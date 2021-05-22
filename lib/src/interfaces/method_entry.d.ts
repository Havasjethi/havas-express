import { ExpressRequest, ExpressResponse } from "../../index";
import { MiddlewareObject } from "../middleware";
import { ExpressHttpMethod } from "../types/native_http_methods";
export declare type MiddlewareFunction = (req: ExpressRequest, res: ExpressResponse, next: any) => any;
export declare type Middleware = MiddlewareObject | MiddlewareFunction;
export interface MiddlewareEntry {
    method: ExpressHttpMethod;
    path: string;
}
export declare type UnaryMethodParameterType = 'request' | 'response' | 'next';
export declare type ComplexMethodParameterType = 'path' | 'query' | 'body' | 'parameter' | 'cookie';
export declare type MethodParameterType = UnaryMethodParameterType | ComplexMethodParameterType;
export declare type MethodParameterData = {
    variable_path: string;
};
export interface MethodParameterEntry<T extends MethodParameterType> {
    parameter_type: MethodParameterType;
    parameter_index: number;
    extra_data: T extends ComplexMethodParameterType ? MethodParameterData : undefined;
}
export interface MethodEntry {
    http_method: ExpressHttpMethod;
    object_method: string;
    path: string;
    middlewares: Middleware[];
    method_parameters: MethodParameterEntry<any>[];
    use_wrapper: boolean;
}
