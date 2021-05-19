import { ExpressRequest, ExpressResponse } from "../index";
import { Middleware, MiddlewareEntry } from "./interfaces/method_entry";
import { SetProperty } from "./util/class_decorator_util";
import { ExpressRoutable, Routable } from "./classes/routable";
import { ExpressHttpMethod } from "./types/native_http_methods";

export abstract class MiddlewareObject {

  public abstract handle(req: ExpressRequest, res: ExpressResponse, next: Function): void;
}

export abstract class PipeMiddleware extends MiddlewareObject{

  handle(req: ExpressRequest, res: ExpressResponse, next: Function) {
    const rv = this.handle_method(req, res);
    if (rv) {
      next();
    }
  }

  /**
   * If the returned value is `false` the next handler won't be called
   * @param req
   * @param res
   */
  public abstract handle_method(req: ExpressRequest, res: ExpressResponse): void | boolean;
}

// TODO :: Remove usage of `class_extender`

export function UseMiddleware<R extends ExpressRoutable>(...middlewares: Middleware[]) {
  const middleware_functions = middlewares.map((e: Middleware) => (typeof e === 'function') ? e : e.handle.bind(e));

  return SetProperty<Routable<R>>((created_element) => {
    created_element.add_constructor_middleware({path: '/', middleware_functions });
  });
}

export function MethodSpecificMiddlewares<R extends ExpressRoutable>(method: ExpressHttpMethod, ...middlewares: Middleware[]) {
  const middleware_functions = middlewares.map((e: Middleware) => (typeof e === 'function') ? e : e.handle.bind(e));

  return SetProperty<Routable<R>>((created_element) => {
    created_element.add_constructor_middleware({method, path: '/', middleware_functions });
  });
}

export function ComplexMiddleware<R extends ExpressRoutable>({method, path}: MiddlewareEntry, ...middlewares: Middleware[]) {
  const middleware_functions = middlewares.map((e: Middleware) => (typeof e === 'function') ? e : e.handle.bind(e));

  return SetProperty<Routable<R>>((created_element) => {
    created_element.add_constructor_middleware({method, path, middleware_functions });
  });
}
