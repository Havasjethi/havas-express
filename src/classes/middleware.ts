import { ExpressRequest, ExpressResponse } from '../../index';
import { Middleware, ExpressFunction } from '../types/classes/middleware';

export interface MiddlewareObject {
  handle: (req: ExpressRequest, res: ExpressResponse, next: Function) => any;
}

export abstract class MiddlewareClass {
  abstract get_handle(): Middleware;
}

export abstract class PipeMiddleware extends MiddlewareClass implements MiddlewareObject {
  get_handle(): ExpressFunction {
    return this.handle;
  }

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

export abstract class AsyncPipeMiddleware implements MiddlewareObject {
  get_handle() {
    return (req: ExpressRequest, res: ExpressResponse, next: Function) =>
      this.handle(req, res, next);
  }

  async handle(req: ExpressRequest, res: ExpressResponse, next: Function) {
    await this.handle_method(req, res);
    next();
  }

  /**
   * If the returned value is `false` the next handler won't be called
   * @param req
   * @param res
   */
  public abstract handle_method(req: ExpressRequest, res: ExpressResponse): Promise<void>;
}
