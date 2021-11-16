import { Controller } from 'havas-core';
import { Container, decorate, injectable } from 'inversify';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { Constructor } from '../util/class_decorator_util';
import { wrapperConstructorName } from '../util/class_extender';
import { mainContainer } from './container';

export const getName = (target: Constructor<ExpressCoreRoutable>) =>
  target.name !== wrapperConstructorName ? target.name : target.prototype.constructor.name;

export const getWrapper = (target: Constructor<any>) =>
  target.name !== wrapperConstructorName ? target : target.prototype.constructor.name;

class ComposableTreeNode<T> {
  childrend: ComposableTreeNode<T>[] = [];
  constructor(public value: T) {}

  isPresent(): boolean {
    return this.value !== undefined;
  }

  addChild(x: ComposableTreeNode<T>): this {
    this.childrend.push(x);
    return this;
  }

  addChildrend(x: ComposableTreeNode<T>[]): this {
    this.childrend.push(...x);
    return this;
  }
}
// export class ControllerTreeNode extends ComposableTreeNode<Constructor<ExpressCoreRoutable>> {
//   constructor(x: Constructor<ExpressCoreRoutable> | undefined) {
//     super(x!);
//   }
// }

export class ComposableTreeCreator<T> {
  cachedTree?: Constructor<ComposableTreeNode<T>>;
  constructor(
    private nodeConstructor: Constructor<ComposableTreeNode<T>>,
    private mainNode?: T,
    private subNodes: [node: T, parnet: T | undefined][] = [],
  ) {}

  public registerMainNode(node: T) {
    if (this.mainNode !== undefined) {
      throw new Error('You already declared a mainController!');
    }

    this.mainNode = node;
  }

  public registerNode(node: T, parentNode?: T) {
    if (this.mainNode === undefined) {
      throw new Error('Main value not registered');
    }

    this.subNodes.push([node, parentNode]);
  }

  /**
   * Contains one or more trees
   */
  public getTrees(): ComposableTreeNode<T>[] {
    return this.mainNode ? [this.composeMainTree()] : this.composeForest();
  }

  private composeMainTree(): ComposableTreeNode<T> {
    const mainNode = new this.nodeConstructor(this.mainNode);

    const lameLookup: ComposableTreeNode<T>[] = [];
    const missingParents: [T, T | undefined][] = [];

    for (const [node, parent] of this.subNodes) {
      if (!parent || parent === this.mainNode) {
        const wrappedNode = new this.nodeConstructor(node);
        mainNode.addChild(wrappedNode);
        lameLookup.push(wrappedNode);
      } else {
        missingParents.push([node, parent]);
      }
    }

    let currentIteration = missingParents;
    let maxItarations = 100;

    do {
      for (const [node, parent] of currentIteration.splice(0)) {
        const index = lameLookup.findIndex((e) => e.value === parent);

        if (index > 0) {
          const wrappedNode = new this.nodeConstructor(node);

          lameLookup[index].addChild(wrappedNode);
          lameLookup.push(wrappedNode);
        } else {
          currentIteration.push([node, parent]);
        }
      }
    } while (currentIteration.length !== 0 && maxItarations-- > 0);

    if (currentIteration.length !== 0) {
      throw new Error('Cannot insert elements, missing parents!');
    }

    return mainNode;
  }

  private composeForest(): ComposableTreeNode<T>[] {
    const remainingItems = [];
    const iterationItems = [];

    const lameLookup: [item: ComposableTreeNode<T>, parnet: T][] = [];

    for (const [node, parent] of this.subNodes) {
      if (parent === undefined) {
        iterationItems.push([node, parent]);
        lameLookup.push([new this.nodeConstructor(node), node]);
      } else {
        remainingItems.push([node, parent]);
      }
    }

    let maxIteration = 100;
    while (remainingItems.length === 0 && maxIteration-- > 0) {
      for (const [node, parent] of remainingItems.splice(0)) {
        const matchingParent = lameLookup.find((e) => e[1] === parent);

        if (matchingParent !== undefined) {
          const wrappedNode = new this.nodeConstructor(node);
          lameLookup.push([wrappedNode, node]);
          matchingParent[0].addChild(wrappedNode);
        } else {
          remainingItems.push([node, parent]);
        }
      }
    }

    return lameLookup.map((e) => e[0]);
  }
}

export class ControllerTree extends ComposableTreeCreator<Constructor<ExpressCoreRoutable>> {
  constructor() {
    super(ComposableTreeNode);
  }

  public initialize(container: Container): ExpressCoreRoutable[] {
    return this.getTrees().map((e) => this.initalizeNode(e, container));
  }

  public initalizeNode(
    node: ComposableTreeNode<Constructor<ExpressCoreRoutable>>,
    container: Container,
  ): ExpressCoreRoutable {
    const initializedController = container.get(node.value);

    node.childrend.forEach((child) =>
      initializedController.addChild(this.initalizeNode(child, container)),
    );

    return initializedController;
  }
}
