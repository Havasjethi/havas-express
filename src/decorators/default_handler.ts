import { Routable } from "../classes/routable";
import { extender } from "../util/class_decorator_util";


export function DefaultHandler<T extends Routable = Routable>(target: T, method_name: keyof T, desc: PropertyDescriptor) {
  extender.set_property<T>(target.constructor.name, (new_instance) =>
    new_instance.set_default_handler(method_name));
}

export function ErrorHandlerMethod<T extends Routable = Routable>(target: T, method_name: keyof T, desc: PropertyDescriptor) {
  extender.set_property<Routable>(target.constructor.name, new_instance => new_instance.add_error_handler_method(method_name))
}
