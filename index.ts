export * from './src/decorators/method_decorator';
export * from './src/decorators/method_paramter_decorators';
export * from './src/parameter_decorator';
export * from './src/decorators/default_handler';
export { extender, BeforeCreate, SetProperty, AfterCreate } from './src/util/class_decorator_util';
export * from './src/classes/app';
export * from './src/classes/middleware';
export * from './src/classes/router';
export * from './src/classes/express_core_routable';
export * from './src/classes/types/endpoint';
export * from './src/di/class_decorators';
export * from './src/di/container';
export * from './src/di/controller_tree';
export * from './src/di/reader';
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
