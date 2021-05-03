import {Router as ExpressRouter} from "express";
import {Routable} from "./classes/routable";

export class Router extends Routable<ExpressRouter> {
  // public static path: string = '/';

  constructor() {
    super(ExpressRouter());
  }

  remove_layers(): void {
    this.get_routable().stack.splice(0);
  }
}
