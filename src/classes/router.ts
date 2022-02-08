import { Router as ExpressRouter } from 'express';
import { ExpressCoreRoutable } from './express_core_routable';

export class Router extends ExpressCoreRoutable<ExpressRouter> {
  constructor() {
    super(ExpressRouter(), 'router');
  }

  removeLayers() {
    this.getRoutable().stack.splice(0);
  }

  /**
   * @deprecated - Use `Router.removeLayers`
   */
  remove_layers(): void {
    this.removeLayers();
  }
}
