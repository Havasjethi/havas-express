import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { AfterCreate, Constructor } from '../util/class_decorator_util';
import { wrapperConstructorName } from '../util/class_extender';
import { mainContainer, MainControllerTree } from './container';

export const AMainController = (target: Constructor<ExpressCoreRoutable>) => {
  // console.log(target.constructor.name);

  MainControllerTree.registerMainNode(target);
  // return AfterCreate((newInstance) => {
  //   MainControllerTree.registerMainNode(newInstance);
  // });
};

export const Controller = (parent?: ExpressCoreRoutable) => {
  return AfterCreate((newInstance) => console.log(newInstance.constructor.name));
};
