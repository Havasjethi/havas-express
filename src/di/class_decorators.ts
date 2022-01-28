import 'reflect-metadata';

import { decorate, injectable } from 'inversify';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { Constructor, OnlyWrap } from '../util/class_decorator_util';
import { mainContainer, MainControllerTree } from './container';

// Todo :: Wrap Target | Replace  AfterCreate((newInstance) => {})
export const AMainController = (target: Constructor<ExpressCoreRoutable>) => {
  decorate(injectable(), target);
  const wrappedTarget = OnlyWrap(target);
  MainControllerTree.registerMainNode(wrappedTarget);
  mainContainer.bind(wrappedTarget).toSelf();

  return wrappedTarget;
};

export const Controller = (parent?: Constructor<ExpressCoreRoutable>) => {
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
  mainContainer.bind(identifier ?? target).toSelf();
};
