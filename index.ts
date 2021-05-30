export * from "./src/decorators/method_decorator";
export * from "./src/decorators/method_paramter_decorators";
export * from "./src/decorators/default_handler";
export { extender, BeforeCreate, SetProperty, AfterCreate } from "./src/util/class_decorator_util";
export * from "./src/classes/app";
export * from "./src/classes/middleware";
export * from "./src/classes/router";
export * from "./src/decorators/class_decorator";
export * from "./src/decorators/middleware_decorators";

import { Response, Request, ParamsDictionary, Router as ExpressRouter } from "express-serve-static-core";
import { ParsedQs } from 'qs';

export type ExpressRequest = Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
export type ExpressResponse = Response<any, Record<string, any>, number>;
