import { ExpressRoutable, Routable } from "../classes/express_core_routable";
import { ExpressHttpMethod } from "../types/native_http_methods";
import { Middleware, MiddlewareEntry } from "../interfaces/method_entry";
import { SetProperty } from "../util/class_decorator_util";

export function UseMiddleware<R extends ExpressRoutable>(...middlewares: Middleware[]) {
  return SetProperty<Routable<R>>((created_element) => {
    created_element.add_constructor_middleware({path: '/', middlewares});
  });
}

export function MethodSpecificMiddlewares<R extends ExpressRoutable>(method: ExpressHttpMethod, ...middlewares: Middleware[]) {
  return SetProperty<Routable<R>>((created_element) => {
    created_element.add_constructor_middleware({method, path: '/', middlewares});
  });
}

export function ComplexMiddleware<R extends ExpressRoutable>({ method, path }: MiddlewareEntry, ...middlewares: Middleware[]) {
  return SetProperty<Routable<R>>((created_element) => {
    created_element.add_constructor_middleware({method, path, middlewares});
  });
}
