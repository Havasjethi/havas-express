import { ExpressCoreRoutable } from '../classes';
import { ExpressFunction } from '../types';
import { extender, SetProperty } from '../util';

// const MethodClassDecorator = (a, b) => { }
// TODO :: Mixed Constructor branches :: MethodClassDecorator(func, fnc) => FactoryOrNot<Method | ClassDecorator>
export const DefaultHandlerFunction = (handler: ExpressFunction) =>
  SetProperty<ExpressCoreRoutable>((instance) => instance.registerDefaultHandlerFunction(handler));

export function DefaultHandler<T extends ExpressCoreRoutable = ExpressCoreRoutable>(
  target: T,
  methodName: string,
  _desc: PropertyDescriptor,
) {
  extender.set_property<T>(target.constructor.name, (new_instance) =>
    new_instance.registerDefaultHandlerMethod(methodName),
  );
}

/**
 * The decorated method will be called with ErrorHandlerParams
 * @see {ErrorHandlerParams}
 */
export function ErrorHandlerMethod<T extends ExpressCoreRoutable = ExpressCoreRoutable>(
  target: T,
  methodName: string, // keyof T,
  _desc: PropertyDescriptor,
) {
  extender.set_property<ExpressCoreRoutable>(target.constructor.name, (new_instance) =>
    new_instance.registerErrorHandler(methodName),
  );
}
