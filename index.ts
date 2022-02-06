export * from './src/decorators/method_decorator';
export * from './src/decorators/method_paramter_decorators';
export * from './src/parameter_decorator/index';
export * from './src/classes/index';
export * from './src/decorators/default_handler';
export { extender, BeforeCreate, SetProperty, AfterCreate } from './src/util/class_decorator_util';
export * from './src/di/index';
export * from './src/decorators/class_decorator';
export * from './src/decorators/middleware_decorators';

import {
  Response as Res,
  Request as Req,
  NextFunction,
  ParamsDictionary,
  Router as ExpressRouter,
} from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export type Response = Res;
export type Request = Req;
export type Next = NextFunction;

export type ExpressRequest = Req<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
export type ExpressResponse = Res<any, Record<string, any>, number>;
export type ExpressNext = NextFunction;
