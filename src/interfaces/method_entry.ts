import { PostProcessor } from 'havas-core';
import { ExpressRequest, ExpressResponse } from '../../index';
import { MiddlewareObject } from '../classes/middleware';
import { Middleware } from '../types/classes/middleware';
import { ExpressHttpMethod } from '../types/native_http_methods';

// export type MiddlewareFunction = IRouterHandler<any>;

export interface MiddlewareEntry {
  method: ExpressHttpMethod;
  path: string;
}

export type UnaryMethodParameterType = 'request' | 'response' | 'next';
export type ComplexMethodParameterType =
  | 'path'
  | 'query'
  | 'body'
  | 'parameter'
  | 'cookie'
  | 'session'
  | 'sessionId';

export type MethodParameterType = UnaryMethodParameterType | ComplexMethodParameterType;

export type MethodParameterData = {
  variable_path: string;
};

export interface MethodParameterEntry<T extends MethodParameterType> {
  parameter_type: MethodParameterType;
  parameter_index: number;
  extra_data: T extends ComplexMethodParameterType ? MethodParameterData : undefined;
}

export type RequestMethodProcessing = {
  parameter_extractors: Array<{
    parameter_index: number;
    extractor_name: string;
    arguments: any[];
  }>;
  preprocessor_parameter: MethodParameterEntry<any>[];
  post_processors: {
    [parameter_index: number]: PostProcessor[];
  };
};

// export interface MethodEntry<T extends Routable<any> = Routable<any>> {
export interface MethodEntry extends RequestMethodProcessing {
  http_method?: ExpressHttpMethod;
  object_method_name?: string; // keyof <Current Object?>
  object_method?: CallableFunction; // keyof <Current Object?>
  path?: string;
  middlewares: Middleware[];
  use_wrapper?: boolean;
}

export type PostProcessorType<From = unknown, To = unknown> = (arg: From) => To;
