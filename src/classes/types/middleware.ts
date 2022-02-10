import { NextFunction } from 'express';
import { ExpressRequest, ExpressResponse, MiddlewareObject } from '../../../index';
import { ExpressHttpMethod } from '../../types/native_http_methods';

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

/**
 * TODO :: Improve MiddlewareObject to handle Decorators, also move to common
 */
export type Middleware = MiddlewareObject | ExpressFunction | AsyncMiddlewareFunction;

export interface RegistrableMiddleware {
  path: string;

  method?: ExpressHttpMethod;
  middlewares: Middleware[];
}
