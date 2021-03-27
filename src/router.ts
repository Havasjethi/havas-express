import {ExpressRoutable, MethodHolder} from "./classes/method_holder";
import {Router as ExpressRouter} from "express";
import {Routable} from "./classes/routable";

export class Router extends Routable<ExpressRouter> {
  public static path: string = '/';

  constructor() {
    super(ExpressRouter());

    // @ts-ignore
    const self: typeof Router = this.constructor;

    this.setup_methods();
    // @ts-ignore
    // self.methods.map(e => this.express_router[e.http_method](e.path, this[e.object_method]));
  }
}
