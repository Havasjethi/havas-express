import {Delete, Get, Method, Post } from "./src/decorators/method_decorator";
import { App } from "./src/app";
import { Router } from "./src/router";
import { Host, Path } from "./src/decorators/class_decorator";
import { Response, Request, ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from 'qs';
import {ComplexMiddleware, MethodSpecificMiddlewares, MiddlewareObject, PipeMiddleware, RoutableMiddlewares } from "./src/middleware";
import express, { Router as ExpressRouter } from "express";

type ExpressRequest = Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>; // Request vs IRouterHandler
type ExpressResponse = Response<any, Record<string, any>, number>;  // Response vs IRouterHandler

export default express;
export {
  Get, Post, Delete, Method,
  App, Router,
  Path, Host,
  ExpressRequest, ExpressResponse,
  MiddlewareObject, PipeMiddleware,
  RoutableMiddlewares, MethodSpecificMiddlewares, ComplexMiddleware
  ,ExpressRouter
};
