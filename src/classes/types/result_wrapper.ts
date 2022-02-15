import { RegistrableMethod } from 'havas-core';
import { ExpressRequest, ExpressResponse, Next } from '../../../index';

export interface ResultWrapperFunctionParameters<T = any> {
  result: T;
  request: ExpressRequest;
  response: ExpressResponse;
  next: Next;
}

/**
 * Todo :: Add ResultWrapperMethod
 */
export type ResultWrapperType<T = unknown> = ResultWrapperFunction<T> | RegistrableMethod;
export type ResultWrapperFunction<T = unknown> = ({
  result,
  request,
  response,
  next,
}: ResultWrapperFunctionParameters<T>) => void;

export type ResultWrapperTypeCallable = ({
  response,
  request,
  next,
  result,
}: {
  response: any;
  request: any;
  next: any;
  result: any;
}) => any;
