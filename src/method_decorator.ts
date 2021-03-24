import {App, MethodHolder} from "./app";
import {ExpressHttpMethod} from "./types/native_http_methods";

export function Get (path: string) {
  return function (target: App, propertyKey: string, descriptor: PropertyDescriptor) {
    target.get_static().add_method(propertyKey, "get", path);
  };
}

export function Post (path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target.get_static().add_method(propertyKey, "post", path);
  };
}

export function Http (method: ExpressHttpMethod, path: string) {
  return function (target: MethodHolder, propertyKey: string, descriptor: PropertyDescriptor) {
    target.get_static().add_method(propertyKey, method, path);
  };
}
