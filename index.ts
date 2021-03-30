import {Delete, Get, Method, Post } from "./src/decorators/method_decorator";
import { App } from "./src/app";
import { Router } from "./src/router";
import { Host, Path } from "./src/decorators/class_decorator";
import { Response, Request, ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from 'qs';

type ExpressRequest = Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>; // Request
type ExpressResponse = Response<any, Record<string, any>, number>;  // Response

export {
  Get, Post, Delete, Method,
  App, Router,
  Path, Host,
  ExpressRequest, ExpressResponse
};
