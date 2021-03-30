import {ExpressHttpMethod} from "../types/native_http_methods";
import {MethodHolder} from "../classes/method_holder";
import {Middleware} from "../interfaces/method_entry";

export function Get (path: string = '/', ...middlewares: Middleware[]) {
  return function (target: MethodHolder, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, 'get', path, middlewares);
  };
}

export function Post (path: string = '/', ...middlewares: Middleware[]) {
  return function (target: MethodHolder, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, 'post', path, middlewares);
  };
}

export function Delete (path: string = '/', ...middlewares: Middleware[]) {
  return function (target: MethodHolder, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, 'delete', path, middlewares);
  };
}

export function Method (method: ExpressHttpMethod, path: string, ...middlewares: Middleware[]) {
  return function (target: MethodHolder, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, method, path, middlewares);
  };
}

function add_function (target: MethodHolder, method_name: string, method_type: ExpressHttpMethod, path: string, middlewares: Middleware[]) {
  target
    .get_static()
    .add_method(method_name, method_type, path, middlewares);
}
