import { Router as ExpressRouter } from "express";
import { Routable } from "./routable";

export class Router extends Routable<ExpressRouter> {
  constructor() {
    super(ExpressRouter());
  }

  remove_layers(): void {
    this.get_routable().stack.splice(0);
  }
}
