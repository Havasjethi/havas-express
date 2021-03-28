import {ExpressHttpMethod} from "../types/native_http_methods";
import {MethodHolder} from "../classes/method_holder";

export function Get (path: string = '/') {
  return function (target: MethodHolder, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, 'get', path);
  };
}

export function Post (path: string) {
  return function (target: MethodHolder, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, 'post', path);
  };
}

export function Delete (path: string) {
  return function (target: MethodHolder, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, 'delete', path);
  };
}

export function Method (method: ExpressHttpMethod, path: string) {
  return function (target: MethodHolder, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, method, path);
  };
}

function add_function (target: MethodHolder, method_name: string, method_type: ExpressHttpMethod, path: string) {
  target.get_static().add_method(method_name, method_type, path);
}
