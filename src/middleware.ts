import {ExpressRequest, ExpressResponse} from "../index";
import {Middleware, MiddlewareEntry} from "./interfaces/method_entry";
import {after_create, class_extender} from "./decorators/util";
import {Routable} from "./classes/routable";
import {ExpressRoutable} from "./classes/method_holder";
import {IRouter} from "express";
import {ExpressHttpMethod} from "./types/native_http_methods";

export abstract class MiddlewareObject {

  public abstract handle(req: ExpressRequest, res: ExpressResponse, next: Function): void;
}

export abstract class PipeMiddleware extends MiddlewareObject{

  handle(req: ExpressRequest, res: ExpressResponse, next: Function) {
    this.handle_method(req, res);
    next();
  }

  abstract handle_method(req: ExpressRequest, res: ExpressResponse): any;
}

export function RoutableMiddlewares<R extends ExpressRoutable>(...middlewares: Middleware[]) {
  const middleware_functions = middlewares.map((e: Middleware) => (typeof e === 'function') ? e : e.handle.bind(e));

  return class_extender<Routable<R>, any>((created_element) => {
    // TODO :: Fix Problem: Middlewares are added after initialization => The Layers added to the end of the array
    created_element.add_constructor_middleware({path: '/', middleware_functions });
  });
}

export function MethodSpecificMiddlewares<R extends ExpressRoutable>(method: ExpressHttpMethod, ...middlewares: Middleware[]) {
  const middleware_functions = middlewares.map((e: Middleware) => (typeof e === 'function') ? e : e.handle.bind(e));

  return class_extender<Routable<R>, any>((created_element) => {
    created_element.add_constructor_middleware({method, path: '/', middleware_functions });
  });
}

export function ComplexMiddleware<R extends ExpressRoutable>({method, path, middlewares}: MiddlewareEntry) {
  const middleware_functions = middlewares.map((e: Middleware) => (typeof e === 'function') ? e : e.handle.bind(e));

  return class_extender<Routable<R>, any>((created_element) => {
    created_element.add_constructor_middleware({method, path, middleware_functions });
  });
}
