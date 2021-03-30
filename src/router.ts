import {Router as ExpressRouter} from "express";
import {Routable} from "./classes/routable";

export class Router extends Routable<ExpressRouter> {
  public static path: string = '/';

  constructor() {
    super(ExpressRouter());

    this.setup_methods();
  }
}
