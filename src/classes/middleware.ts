import { ExpressRequest, ExpressResponse } from '../../index';
import { ExpressFunction, Middleware } from '../types/classes/middleware';

export interface MiddlewareObject {
  getHandler: (req: ExpressRequest, res: ExpressResponse, next: Function) => any;
}

export abstract class PipeMiddleware implements MiddlewareObject {
  getHandler(req: ExpressRequest, res: ExpressResponse, next: Function) {
    this.handle(req, res);
    next();
  }

  /**
   * @param req
   * @param res
   */
  public abstract handle(req: ExpressRequest, res: ExpressResponse): void;
}

export abstract class AsyncPipeMiddleware implements MiddlewareObject {
  async getHandler(req: ExpressRequest, res: ExpressResponse, next: Function) {
    await this.handle(req, res);
    next();
  }

  /**
   * If the returned value is `false` the next handler won't be called
   * @param req
   * @param res
   */
  public abstract handle(req: ExpressRequest, res: ExpressResponse): Promise<void>;
}
