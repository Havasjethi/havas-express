import { ExpressRequest, ExpressResponse } from "../../index";

export interface MiddlewareObject {
  handle: (req: ExpressRequest, res: ExpressResponse, next: Function) => any;
}

export abstract class PipeMiddleware implements MiddlewareObject {

  handle(req: ExpressRequest, res: ExpressResponse, next: Function) {
    this.handle_method(req, res);
    next();
  }

  /**
   * If the returned value is `false` the next handler won't be called
   * @param req
   * @param res
   */
  public abstract handle_method(req: ExpressRequest, res: ExpressResponse): void;
}
