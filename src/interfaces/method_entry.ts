import {ExpressRequest, ExpressResponse} from "../../index";
import {MiddlewareObject} from "../classes/middleware";
import {ExpressHttpMethod} from "../types/native_http_methods";

// export type MiddlewareFunction = IRouterHandler<any>;
export type MiddlewareFunction = (req: ExpressRequest, res: ExpressResponse, next: any) => any;
export type AyncMiddlewareFunction<T = unknown> = (req: ExpressRequest, res: ExpressResponse, next: any) => Promise<T>;

export type Middleware = MiddlewareObject | MiddlewareFunction | AyncMiddlewareFunction;

export interface MiddlewareEntry {
  method: ExpressHttpMethod;
  path: string;
}

export type UnaryMethodParameterType = 'request' | 'response' | 'next';
export type ComplexMethodParameterType = 'path' | 'query' | 'body' | 'parameter' | 'cookie' | 'session' | 'sessionId';

export type MethodParameterType = UnaryMethodParameterType | ComplexMethodParameterType;
export type MethodParameterData = {
  variable_path: string,
};

export interface MethodParameterEntry<T extends MethodParameterType> {
  parameter_type: MethodParameterType,
  parameter_index: number;
  extra_data: T extends ComplexMethodParameterType ? MethodParameterData : undefined;
}

export type PostProcessorType<Input = any, Outout = any> = (value: Input) => Outout;

// export interface MethodEntry<T extends Routable<any> = Routable<any>> {
export interface MethodEntry {
  http_method?: ExpressHttpMethod;
  object_method_name?: string; // keyof <Current Object?>
  object_method?: CallableFunction; // keyof <Current Object?>
  path?: string;
  middlewares: Middleware[];
  preprocessor_parameter: MethodParameterEntry<any>[];
  post_processors: {[parameter_index: number]: PostProcessorType<any, any>[]};
  use_wrapper?: boolean;
}
