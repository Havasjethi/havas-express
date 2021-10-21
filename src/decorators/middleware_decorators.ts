import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { Middleware } from '../classes/types/middleware';
import { ExpressHttpMethod } from '../types/native_http_methods';
import { MiddlewareEntry } from '../interfaces/method_entry';
import { SetProperty } from '../util/class_decorator_util';

export function UseMiddleware(...middlewares: Middleware[]) {
  return SetProperty<ExpressCoreRoutable<any>>((created_element) => {
    created_element.add_constructor_middleware({ path: '/', middlewares });
  });
}

export function MethodSpecificMiddlewares(method: ExpressHttpMethod, ...middlewares: Middleware[]) {
  return SetProperty<ExpressCoreRoutable<any>>((created_element) => {
    created_element.add_constructor_middleware({ method, path: '/', middlewares });
  });
}

export function ComplexMiddleware({ method, path }: MiddlewareEntry, ...middlewares: Middleware[]) {
  return SetProperty<ExpressCoreRoutable<any>>((created_element) => {
    created_element.add_constructor_middleware({ method, path, middlewares });
  });
}
