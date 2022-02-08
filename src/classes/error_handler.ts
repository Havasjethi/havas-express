import { NextFunction } from "express";
import { ExpressRequest, ExpressResponse } from "../../index";

export type ErrorHandlerFunction = (error: Error, request: ExpressRequest, response: ExpressResponse, next: NextFunction) => any;
export type ErrorHandlerParams = {error: Error, request: ExpressRequest, response: ExpressResponse, next: NextFunction};

export interface ErrorHandlerClass {
  handle: (object: ErrorHandlerParams) => any;
}

export class PipeErrorHandler implements ErrorHandlerClass {

  constructor(protected error_handler: (parameters: {error: any, request: ExpressRequest, response: ExpressResponse}) => void) {}

  public handle({error, request, response, next}: ErrorHandlerParams): any {
    this.error_handler({error, request, response});
    next(error);
  }
}
