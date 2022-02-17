export * from './src/classes';
export { extender, BeforeCreate, SetProperty, AfterCreate } from './src/util/class_decorator_util';
export * from './src/di/';
export * from './src/decorators/parameter_decorator_storage';
export * from './src/decorators/index';
export * from './src/types';

import {
  Response as Res,
  Request as Req,
  NextFunction,
  ParamsDictionary,
} from 'express-serve-static-core';
import { ParsedQs } from 'qs';

export type Response = Res;
export type Request = Req;
export type Next = NextFunction;

export type ExpressRequest = Req<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
export type ExpressResponse = Res<any, Record<string, any>, number>;
export type ExpressNext = NextFunction;
