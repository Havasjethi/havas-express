import { Container } from 'inversify';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { Constructor } from '../util/class_decorator_util';
import { wrapperConstructorName } from '../util/class_extender';

const getName = (target: Constructor<ExpressCoreRoutable>) =>
  target.constructor.name !== wrapperConstructorName
    ? target.constructor.name
    : target.prototype.constructor.name;

export class ControllerTree {
  constructor(private mainNode?: Constructor<ExpressCoreRoutable>) {}

  public registerMainNode(node: Constructor<ExpressCoreRoutable>) {
    if (this.mainNode !== undefined) {
      throw new Error('You already declared a shit!');
    }

    this.mainNode = node;
  }

  public registerNode(node?: ExpressCoreRoutable) {
    if (this.mainNode === undefined) {
      throw new Error('Main node not registered');
    }
  }

  public initialize(container: Container) {
    console.log('Initialize', this.mainNode!.name);
    console.log('Initialize', this.mainNode!.constructor.name);
    // container.get(get)
  }
}
