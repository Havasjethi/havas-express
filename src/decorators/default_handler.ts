import { Routable } from "../classes/express_core_routable";
import { extender } from "../util/class_decorator_util";


export function DefaultHandler<T extends Routable = Routable>(target: T, method_name: keyof T, desc: PropertyDescriptor) {
  extender.set_property<T>(target.constructor.name, (new_instance) =>
    new_instance.set_default_handler(method_name));
}

/**
 * The decorated method will be called with ErrorHanderParams
 * @see {ErrorHanderParams}
 */
export function ErrorHandlerMethod<T extends Routable = Routable>(target: T, method_name: keyof T, desc: PropertyDescriptor) {
  extender.set_property<Routable>(target.constructor.name, new_instance => new_instance.add_error_handler_method(method_name))
}
