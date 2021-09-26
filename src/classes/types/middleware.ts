import { ExpressRequest, ExpressResponse, MiddlewareObject } from '../../../index';
import { ExpressHttpMethod } from '../../types/native_http_methods';


export type MiddlewareFunction = (req: ExpressRequest, res: ExpressResponse, next: any) => any;
export type AyncMiddlewareFunction<T = unknown> = (req: ExpressRequest, res: ExpressResponse, next: any) => Promise<T>;

/**
 * TODO :: Impreve MiddlewareObject to handle Decorators, also move to common
 */
export type Middleware = MiddlewareObject | MiddlewareFunction | AyncMiddlewareFunction;

export interface RegistrableMiddleware {
  path: string;

  method?: ExpressHttpMethod;
  middlewares: Middleware[];
}
