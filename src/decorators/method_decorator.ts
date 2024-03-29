import { Middleware } from '../classes/types/middleware';
import { ExpressHttpMethod } from '../types/native_http_methods';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { extender } from '../util/class_decorator_util';

// function add_function(
//   target: Routable<any>,
//   method_name: string,
//   method_type: ExpressHttpMethod,
//   path: string,
//   middlewares: Middlewareeware[],
// ) {
//   extender.set_property<Routable>(target.constructor.name, (x) => {
//     x.add_method(method_name, method_type, path, middlewares);
//   });
// }

function add_function(
  target: ExpressCoreRoutable<any>,
  method_name: string,
  method_type: ExpressHttpMethod,
  path: string,
  middlewares: Middleware[],
) {
  extender.setProperty<ExpressCoreRoutable>(target.constructor.name, (instance) => {
    instance.registerEndpoint(method_name, method_type, path, middlewares);
  });
}

// export function Get (path: string = '/', wrap: boolean, ...middlewares: Middleware[]) {
// export function Get (o: {path: string, wrap: boolean} , ...middlewares: Middleware[]) {
// export function Get (...args: [string, ...Middleware[]] | [string, boolean, ...Middleware[]] ) {
export function Get(path: string = '/', ...middlewares: Middleware[]) {
  return function (
    target: ExpressCoreRoutable<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    add_function(target, propertyKey, 'get', path, middlewares);
  };
}

export function Post(path: string = '/', ...middlewares: Middleware[]) {
  return function (
    target: ExpressCoreRoutable<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    add_function(target, propertyKey, 'post', path, middlewares);
  };
}

export function Delete(path: string = '/', ...middlewares: Middleware[]) {
  return function (
    target: ExpressCoreRoutable<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    add_function(target, propertyKey, 'delete', path, middlewares);
  };
}

export function Put(path: string = '/', ...middlewares: Middleware[]) {
  return function (
    target: ExpressCoreRoutable<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    add_function(target, propertyKey, 'put', path, middlewares);
  };
}

export function Option(path: string = '/', ...middlewares: Middleware[]) {
  return function (
    target: ExpressCoreRoutable<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    add_function(target, propertyKey, 'options', path, middlewares);
  };
}

export function Head(path: string = '/', ...middlewares: Middleware[]) {
  return function (
    target: ExpressCoreRoutable<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    add_function(target, propertyKey, 'head', path, middlewares);
  };
}

export function Patch(path: string = '/', ...middlewares: Middleware[]) {
  return function (
    target: ExpressCoreRoutable<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    add_function(target, propertyKey, 'patch', path, middlewares);
  };
}

export function Method(method: ExpressHttpMethod, path: string, ...middlewares: Middleware[]) {
  return function (
    target: ExpressCoreRoutable<any>,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    add_function(target, propertyKey, method, path, middlewares);
  };
}
