export * from "./src/decorators/method_decorator";
export * from "./src/decorators/method_paramter_decorators";
export { extender, BeforeCreate, SetProperty, AfterCreate } from "./src/util/class_decorator_util";
export { App } from "./src/app";
export { Router } from "./src/router";
export * from "./src/decorators/class_decorator";
export * from "./src/middleware";

import { Response, Request, ParamsDictionary, Router as ExpressRouter } from "express-serve-static-core";
import { ParsedQs } from 'qs';

export type ExpressRequest = Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>
export type ExpressResponse = Response<any, Record<string, any>, number>;
