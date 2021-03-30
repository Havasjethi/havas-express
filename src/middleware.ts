import {ExpressRequest, ExpressResponse} from "../index";

export abstract class MiddlewareObject {

  public abstract handle(req: ExpressRequest, res: ExpressResponse, next: Function): void;
}

export abstract class PipeMiddleware extends MiddlewareObject{

  handle(req: ExpressRequest, res: ExpressResponse, next: Function) {
    this.handle_method(req, res);
    next();
  }

  abstract handle_method(req: ExpressRequest, res: ExpressResponse): any;
}
