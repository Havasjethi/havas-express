import 'reflect-metadata';

import { decorate, injectable } from 'inversify';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { AfterCreate, Constructor } from '../util/class_decorator_util';
import { wrapperConstructorName } from '../util/class_extender';
import { mainContainer, MainControllerTree } from './container';
import { getName, getWrapper } from './controller_tree';

// const injector = injectable();

export const AMainController = (target: Constructor<ExpressCoreRoutable>) => {
  decorate(injectable(), target);
  MainControllerTree.registerMainNode(target);
};

export const Controller = (parent?: Constructor<ExpressCoreRoutable>) => {
  return (target: Constructor<ExpressCoreRoutable>) => {
    decorate(injectable(), target);
    MainControllerTree.registerNode(target, parent);

    return AfterCreate((newInstance) => console.log(newInstance.constructor.name))(target);
  };
};
