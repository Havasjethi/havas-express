import { Delete, Get, Method, Post } from "./src/decorators/method_decorator";
import { Body, RequestObj, ResponseObj, PathVariable, Param, Query, Next } from "./src/decorators/method_paramter_decorators";
import { extender, BeforeCreate, SetProperty, AfterCreate } from "./src/util/class_decorator_util";
import { App } from "./src/app";
import { Router } from "./src/router";
import { Host, Path, ResultWrapper } from "./src/decorators/class_decorator";
import { ComplexMiddleware, MethodSpecificMiddlewares, MiddlewareObject, PipeMiddleware, RoutableMiddlewares } from "./src/middleware";

import express from "express";
import { Response, Request, ParamsDictionary, Router as ExpressRouter } from "express-serve-static-core";
import { ParsedQs } from 'qs';

type ExpressRequest = Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>; // Request vs IRouterHandler
type ExpressResponse = Response<any, Record<string, any>, number>;  // Response vs IRouterHandler

const LifecycleClassDecorators = {
  extender, BeforeCreate, SetProperty, AfterCreate
};

export default express;
export {
  Get, Post, Delete, Method,
  RequestObj, ResponseObj, Next, Body, PathVariable, Param, Query,
  LifecycleClassDecorators,
  App, Router,
  Path, Host, ResultWrapper,
  ExpressRequest, ExpressResponse,
  MiddlewareObject, PipeMiddleware,
  RoutableMiddlewares, MethodSpecificMiddlewares, ComplexMiddleware,
};
