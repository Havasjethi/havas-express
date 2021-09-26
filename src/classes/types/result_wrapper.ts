import { RegistrableMethod } from 'havas-core';
import { ExpressRequest, ExpressResponse, Next } from '../../../index';


export interface ResultWrapperFunctionParameters<T = any> {
  result: T;
  request: ExpressRequest;
  response: ExpressResponse;
  next: Next;
};

/**
 * Todo :: Add ResultWrapperMethod
 */
export type ResultWrapperType<T = unknown> = ResultWrapperFunction<T>;// | ResultWrapperMethod;
export type ResultWrapperMethod = RegistrableMethod;
export type ResultWrapperFunction<T = unknown> = ({
  result,
  request,
  response,
  next,
}: ResultWrapperFunctionParameters<T>) => void;
