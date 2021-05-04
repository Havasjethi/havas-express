import express from "express";
import {Routable} from "./classes/routable";

export abstract class App extends Routable<express.Application> {
  public path: string = '/';
  public host: string = 'localhost';
  public port: number = -1;

  constructor() {
    super(express());
  }

  remove_layers(): void {
    this.get_routable()._router.stack.splice(2);
  }

  start_app () {
    const next_layer: Routable<any>[] = [ this ];

    while (next_layer.length) {
      next_layer
        .splice(0)
        .forEach(e => {
          e.setup_layers();
          next_layer.push(...e.children_routable)
        });
    }

    this.routable_object.listen(
      this.port,
      this.host,
      () => console.log(`App is active: http://${this.host}:${this.port}`));
  }
}
