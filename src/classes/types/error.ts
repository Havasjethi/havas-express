import { ErrorRequestHandler } from 'express';
import { DecoratedParameters, RegistrableMethod } from 'havas-core';
import { ErrorHandlerParams, ErrorHandlerClass } from '../error_handler';

export type ErrorHandlerShort = (o: ErrorHandlerParams) => unknown;
export type ErrorHandler = ErrorHandlerClass | ErrorRequestHandler | ErrorHandlerShort;

export enum ErrorHandlerType {
  ErrorHandlerClass,
  ErrorRequestHandler,
  ErrorHandlerShort,
}

export type ErrorHandlerEntry = RegistrableMethod;

export interface RegistrableErrorHandler {
  methodName: string;
  parameters: DecoratedParameters[];
}
