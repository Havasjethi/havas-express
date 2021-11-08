import 'reflect-metadata';

import { injectable } from 'inversify';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { AfterCreate, Constructor } from '../util/class_decorator_util';
import { wrapperConstructorName } from '../util/class_extender';
import { mainContainer, MainControllerTree } from './container';
import { getName, getWrapper } from './controller_tree';

// const injector = injectable();

export const AMainController = (target: Constructor<ExpressCoreRoutable>) => {
  // console.log(target.constructor.name);

  const name = getName(target);
  const getWrapped = getWrapper(target);
  console.log(getWrapped);

  MainControllerTree.registerMainNode(target);
  // return AfterCreate((newInstance) => {
  //   MainControllerTree.registerMainNode(newInstance);
  // });
  // injector(getWrapped);
  injectable()(getWrapped);
};

export const Controller = (parent?: ExpressCoreRoutable) => {
  return AfterCreate((newInstance) => console.log(newInstance.constructor.name));
};
