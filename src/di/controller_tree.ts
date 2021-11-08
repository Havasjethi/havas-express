import { Container, decorate, injectable } from 'inversify';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { Constructor } from '../util/class_decorator_util';
import { wrapperConstructorName } from '../util/class_extender';

export const getName = (target: Constructor<ExpressCoreRoutable>) =>
  target.name !== wrapperConstructorName ? target.name : target.prototype.constructor.name;

export const getWrapper = (target: Constructor<any>) =>
  target.name !== wrapperConstructorName ? target : target.prototype.constructor.name;

class ComposableTreeNode<T> {
  childrend: ComposableTreeNode<T>[] = [];
  constructor(public node: T) {}

  addChild(x: ComposableTreeNode<T>): this {
    this.childrend.push(x);
    return this;
  }

  addChildrend(x: ComposableTreeNode<T>[]): this {
    this.childrend.push(...x);
    return this;
  }
}

export class ControllerTreeNode extends ComposableTreeNode<Constructor<ExpressCoreRoutable>> {
  constructor(x: Constructor<ExpressCoreRoutable> | undefined) {
    super(x!);
  }
}

export class ComposableTree<T> {
  constructor(
    private nodeConstructor: Constructor<ComposableTreeNode<T>>,
    private mainNode?: T,
    private subNodes: [T, T | undefined][] = [],
  ) {}

  public registerMainNode(node: T) {
    if (this.mainNode !== undefined) {
      throw new Error('You already declared a shit!');
    }

    this.mainNode = node;
  }

  public registerNode(node: T, parentNode?: T) {
    if (this.mainNode === undefined) {
      throw new Error('Main node not registered');
    }

    this.subNodes.push([node, parentNode]);
  }

  public initialize(container: Container) {
    const tree = this.getTree();
  }

  public getTree(): ComposableTreeNode<T> {
    return this.composeMainTree();
  }

  private composeMainTree(): ComposableTreeNode<T> {
    const mainNode = new this.nodeConstructor(this.mainNode);

    const lameLookup: ComposableTreeNode<T>[] = [];
    const missingParents: T[] = [];

    this.subNodes.forEach(([node, parent]) => {
      if (!parent || parent === this.mainNode) {
        const wrappedNode = new this.nodeConstructor(node);
        mainNode.addChild(wrappedNode);
        lameLookup.push(wrappedNode);
      } else {
        missingParents.push(node);
      }
    });

    let currentIteration = missingParents;
    let maxItarations = 100;

    do {
      for (const item of currentIteration.splice(0)) {
        const index = lameLookup.findIndex((e) => e.node === item);

        if (index > 0) {
          const wrappedNode = new this.nodeConstructor(item);

          lameLookup[index].addChild(wrappedNode);
          lameLookup.push(wrappedNode);
        } else {
          currentIteration.push(item);
        }
      }
    } while (currentIteration.length !== 0 && maxItarations-- > 0);

    if (currentIteration.length !== 0) {
      throw new Error('Cannot insert elements, missing parents!');
    }

    return mainNode;
  }
}
