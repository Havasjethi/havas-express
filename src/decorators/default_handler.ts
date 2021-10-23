import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { extender } from '../util/class_decorator_util';


// TODO :: Mixed Constructor branches :: MethodClassDecorator(func, fnc) => FactoryOrNot<Method | ClassDecorator>
// export function DefaultHandler = (target: ExpressCoreRoutable) => any; 
// export function DefaultHandler = (target: ExpressCoreRoutable, methodName: string, desc: PropertyDescriptor) => any;

export function DefaultHandler<T extends ExpressCoreRoutable = ExpressCoreRoutable>(
  target: T,
  methodName: string,
  desc: PropertyDescriptor,
) {
  extender.set_property<T>(target.constructor.name, (new_instance) =>
    new_instance.registerDefaultHandlerMethod(methodName),
  );
}

/**
 * The decorated method will be called with ErrorHanderParams
 * @see {ErrorHanderParams}
 */
export function ErrorHandlerMethod<T extends ExpressCoreRoutable = ExpressCoreRoutable>(
  target: T,
  methodName: string, // keyof T,
  desc: PropertyDescriptor,
) {
  extender.set_property<ExpressCoreRoutable>(target.constructor.name, (new_instance) =>
    new_instance.registerErrorHandler(methodName),
  );
}
