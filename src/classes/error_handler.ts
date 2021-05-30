import { ExpressRequest, ExpressResponse } from "../../index";

export interface ErrorHandlerClass {
  handle: (error: any, request: ExpressRequest, response: ExpressResponse, next: Function) => any;
}

export class PipeErrorHandler implements ErrorHandlerClass {

  constructor(protected error_handler: (parameters: {error: any, request: ExpressRequest, response: ExpressResponse}) => void) {}

  public handle(error: any, request: ExpressRequest, response: ExpressResponse, next: Function): any {
    this.error_handler({error, request, response});
    next(error);
  }
}
