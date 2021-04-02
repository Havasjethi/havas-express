import {ExpressRequest, ExpressResponse} from "../../index";
import {MiddlewareObject} from "../middleware";
import {IRouterHandler, RequestHandler} from "express";
import {ExpressHttpMethod} from "../types/native_http_methods";

// export type MiddlewareFunction = IRouterHandler<any>;
export type MiddlewareFunction = (req: ExpressRequest, res: ExpressResponse, next: any) => any;

export type Middleware = MiddlewareObject | MiddlewareFunction;

export interface MiddlewareEntry {
  method: ExpressHttpMethod; // keyof ExpressRouter
  path: string;
  middlewares: Middleware[];
}

export interface MethodEntry {
  http_method: string; // keyof ExpressRouter
  object_method: string; // keyof <Current Object?>
  path: string;
  middlewares: Middleware[];
}
