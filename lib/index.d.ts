import { Delete, Get, Method, Post, Put, Option, Head, Patch } from "./src/decorators/method_decorator";
import { Body, RequestObj, ResponseObj, PathVariable, Param, Query, Next, Cookie } from "./src/decorators/method_paramter_decorators";
import { BeforeCreate, SetProperty, AfterCreate } from "./src/util/class_decorator_util";
import { App } from "./src/app";
import { Router } from "./src/router";
import { Host, Path, ResultWrapper } from "./src/decorators/class_decorator";
import { ComplexMiddleware, MethodSpecificMiddlewares, MiddlewareObject, PipeMiddleware, UseMiddleware } from "./src/middleware";
import { Response, Request, ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from 'qs';
declare type ExpressRequest = Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
declare type ExpressResponse = Response<any, Record<string, any>, number>;
declare const LifecycleClassDecorators: {
    extender: import("./src/util/class_extender").ClassExtender;
    BeforeCreate: typeof BeforeCreate;
    SetProperty: typeof SetProperty;
    AfterCreate: typeof AfterCreate;
};
export { Get, Post, Delete, Put, Option, Head, Patch, Method, RequestObj, ResponseObj, Next, Body, PathVariable, Param, Query, Cookie, LifecycleClassDecorators, App, Router, Path, Host, ResultWrapper, ExpressRequest, ExpressResponse, MiddlewareObject, PipeMiddleware, UseMiddleware, MethodSpecificMiddlewares, ComplexMiddleware, };
