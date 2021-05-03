import {ExpressRequest, ExpressResponse} from "../../index";
import {MiddlewareObject} from "../middleware";
import {ExpressHttpMethod} from "../types/native_http_methods";

// export type MiddlewareFunction = IRouterHandler<any>;
export type MiddlewareFunction = (req: ExpressRequest, res: ExpressResponse, next: any) => any;

export type Middleware = MiddlewareObject | MiddlewareFunction;

export interface MiddlewareEntry {
  method: ExpressHttpMethod;
  path: string;
  middlewares: Middleware[];
}

export type UnaryMethodParameterType = 'request' | 'response' | 'next';
export type ComplexMethodParameterType = 'path' | 'query' | 'body' | 'parameter';

export type MethodParameterType = UnaryMethodParameterType | ComplexMethodParameterType;
export type MethodParameterData = {
  variable_path: string,
};

export interface MethodParameterEntry<T extends MethodParameterType> {
  parameter_type: MethodParameterType,
  parameter_index: number;
  extra_data: T extends ComplexMethodParameterType ? MethodParameterData : undefined;
}

// export interface MethodEntry<T extends Routable<any> = Routable<any>> {
export interface MethodEntry {
  http_method: ExpressHttpMethod;
  object_method: string; // keyof <Current Object?>
  path: string;
  middlewares: Middleware[];
  method_parameters: MethodParameterEntry<any>[];
  use_wrapper: boolean;
}
