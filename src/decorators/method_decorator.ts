import {ExpressHttpMethod} from "../types/native_http_methods";
import {Middleware} from "../interfaces/method_entry";
import {Routable} from "../classes/routable";

// export function Get (path: string = '/', wrap: boolean, ...middlewares: Middleware[]) {
// export function Get (o: {path: string, wrap: boolean} , ...middlewares: Middleware[]) {
// export function Get (...args: [string, ...Middleware[]] | [string, boolean, ...Middleware[]] ) {
export function Get (path: string = '/', ...middlewares: Middleware[]) {
  return function (target: Routable<any>, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, 'get', path, middlewares);
  };
}

export function Post (path: string = '/', ...middlewares: Middleware[]) {
  return function (target: Routable<any>, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, 'post', path, middlewares);
  };
}

export function Delete (path: string = '/', ...middlewares: Middleware[]) {
  return function (target: Routable<any>, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, 'delete', path, middlewares);
  };
}

export function Method (method: ExpressHttpMethod, path: string, ...middlewares: Middleware[]) {
  return function (target: Routable<any>, propertyKey: string, descriptor: PropertyDescriptor) {
    add_function(target, propertyKey, method, path, middlewares);
  };
}

function add_function (target: Routable<any>, method_name: string, method_type: ExpressHttpMethod, path: string, middlewares: Middleware[]) {
  target.add_method(method_name, method_type, path, middlewares);
}
