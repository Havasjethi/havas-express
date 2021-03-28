import {Router as ExpressRouter} from "express";
import {Routable} from "./classes/routable";

export class Router extends Routable<ExpressRouter> {
  public static path: string = '/';

  constructor() {
    super(ExpressRouter());

    // @ts-ignore
    const self: typeof Router = this.constructor;

    this.setup_methods();
  }
}
