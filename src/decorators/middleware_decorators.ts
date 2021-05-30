import { ExpressRoutable, Routable } from "../classes/routable";
import { ExpressHttpMethod } from "../types/native_http_methods";
import { Middleware, MiddlewareEntry } from "../interfaces/method_entry";
import { SetProperty } from "../util/class_decorator_util";

export function UseMiddleware<R extends ExpressRoutable>(...middlewares: Middleware[]) {
  const middleware_functions = middlewares.map((e: Middleware) => (typeof e === 'function') ? e : e.handle.bind(e));

  return SetProperty<Routable<R>>((created_element) => {
    created_element.add_constructor_middleware({path: '/', middleware_functions});
  });
}

export function MethodSpecificMiddlewares<R extends ExpressRoutable>(method: ExpressHttpMethod, ...middlewares: Middleware[]) {
  const middleware_functions = middlewares.map((e: Middleware) => (typeof e === 'function') ? e : e.handle.bind(e));

  return SetProperty<Routable<R>>((created_element) => {
    created_element.add_constructor_middleware({method, path: '/', middleware_functions});
  });
}

export function ComplexMiddleware<R extends ExpressRoutable>({ method, path }: MiddlewareEntry, ...middlewares: Middleware[]) {
  const middleware_functions = middlewares.map((e: Middleware) => (typeof e === 'function') ? e : e.handle.bind(e));

  return SetProperty<Routable<R>>((created_element) => {
    created_element.add_constructor_middleware({method, path, middleware_functions});
  });
}
