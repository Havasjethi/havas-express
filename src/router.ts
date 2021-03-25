import {ExpressRoutable, MethodHolder, Routable} from "./classes/method_holder";
import {Router as ExpressRouter} from "express";

export class Router extends Routable<ExpressRouter> {
  public static path: string = '/';

  constructor() {
    super(ExpressRouter());

    // @ts-ignore
    const self: typeof Router = this.constructor;

    this.map_methods();
    // @ts-ignore
    // self.methods.map(e => this.express_router[e.http_method](e.path, this[e.object_method]));
  }
}
