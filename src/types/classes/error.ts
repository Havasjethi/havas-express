import { ErrorRequestHandler } from 'express';
import { DecoratedParameters, RegistrableMethod } from 'havas-core';
import { UniversalPostProcessor } from '../post_processor_types';
import { ErrorHandlerParams, ErrorHandlerClass } from '../../classes/error_handler';

export type ErrorHandlerShort = (params: ErrorHandlerParams) => unknown;
export type ErrorHandler = ErrorHandlerClass | ErrorRequestHandler | ErrorHandlerShort;

export enum ErrorHandlerType {
  ErrorHandlerClass,
  ErrorRequestHandler,
  ErrorHandlerShort,
}

export type ErrorHandlerEntry = RegistrableMethod<UniversalPostProcessor>;

export interface RegistrableErrorHandler {
  methodName: string;
  parameters: DecoratedParameters<UniversalPostProcessor>[];
}
