import { Container } from 'inversify';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { Constructor } from '../util/class_decorator_util';
import { wrapperConstructorName } from '../util/class_extender';

export const getName = (target: Constructor<ExpressCoreRoutable>) =>
  target.name !== wrapperConstructorName ? target.name : target.prototype.constructor.name;

export const getWrapper = (target: Constructor<any>) =>
  target.name !== wrapperConstructorName ? target : target.prototype.constructor.name;

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
    const item = container.get(getName(this.mainNode!).name);
    console.log('Initialize', getName(this.mainNode!));
    // console.log('Initialize', this.mainNode!.constructor.name);
    // container.get(get)
  }
}
