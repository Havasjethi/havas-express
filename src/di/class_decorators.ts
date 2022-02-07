import { decorate, injectable } from 'inversify';
import { ExpressCoreRoutable } from '../classes';
import { Constructor, OnlyWrap } from '../util';
import { mainContainer, MainControllerTree } from './container';

export const MainController = (target: Constructor<ExpressCoreRoutable>): any => {
  decorate(injectable(), target);
  const wrappedTarget = OnlyWrap(target);
  MainControllerTree.registerMainNode(wrappedTarget as any);
  mainContainer.bind(wrappedTarget).toSelf();

  return wrappedTarget;
};

export const Controller = (parent?: Constructor<ExpressCoreRoutable>): any => {
  return (target: Constructor<ExpressCoreRoutable>) => {
    const wrappedTarget = OnlyWrap(target);
    decorate(injectable(), wrappedTarget);
    MainControllerTree.registerNode(wrappedTarget, parent);
    mainContainer.bind(wrappedTarget).toSelf();

    return wrappedTarget;
  };
};

export const Component = (identifier?: string | symbol) => (target: Constructor<any>) => {
  decorate(injectable(), target);

  if (target.length === 0) {
    mainContainer.bind(identifier ?? target).toSelf();
  }
};
