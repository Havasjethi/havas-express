import { NextFunction } from 'express';
import { ExpressRequest, ExpressResponse, MiddlewareObject } from '../../../index';
import { Constructor } from '../../util';
import { ExpressHttpMethod } from '../native_http_methods';

export type ExpressFunction = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
) => any;

export type AsyncMiddlewareFunction<T = unknown> = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: any,
) => Promise<T>;

export type MiddleWareFunction = ExpressFunction | AsyncMiddlewareFunction;

export type MiddlewareObjectConstructor = Constructor<MiddlewareObject>;

/**
 * TODO :: Improve MiddlewareObject to handle Decorators, also move to common
 */
export type Middleware = MiddlewareObject | MiddlewareObjectConstructor | MiddleWareFunction;

export interface RegistrableMiddleware {
  path: string;

  method?: ExpressHttpMethod;
  middlewares: Middleware[];
}
