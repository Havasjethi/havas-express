import {ExpressRequest, ExpressResponse} from "../../index";
import {MiddlewareObject} from "../middleware";

export type Middleware = MiddlewareObject | ((req: ExpressRequest, res: ExpressResponse, next: any) => any);

export interface MethodEntry {
  http_method: string; // keyof ExpressRouter
  object_method: string; // keyof <Current Object?>
  path: string;
  middlewares: Middleware[];
}
