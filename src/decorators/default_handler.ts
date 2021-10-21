import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { extender } from '../util/class_decorator_util';

export function DefaultHandler<T extends ExpressCoreRoutable = ExpressCoreRoutable>(
  target: T,
  // methodName: keyof T,
  methodName: string,
  desc: PropertyDescriptor,
) {
  extender.set_property<T>(target.constructor.name, (new_instance) =>
    new_instance.registerDefaultHandler(methodName),
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
