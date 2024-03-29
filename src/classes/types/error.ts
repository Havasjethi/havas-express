import { ErrorRequestHandler } from 'express';
import { DecoratedParameters, RegistrableMethod } from 'havas-core';
import { ErrorHanderParams, ErrorHandlerClass } from '../error_handler';

export type ErrorHandlerShort = (o: ErrorHanderParams) => unknown;
export type ErrorHandler = ErrorHandlerClass | ErrorRequestHandler | ErrorHandlerShort;

export enum ErrorHandlerType {
  ErrorHandlerClass,
  ErrorRequestHandler,
  ErrorHandlerShort,
}

export type ErrorHandlerEntry = RegistrableMethod;

export interface RegistreableErrorHandler {
  methodName: string;
  parameters: DecoratedParameters[];
}
