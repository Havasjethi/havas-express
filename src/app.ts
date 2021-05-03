import express from "express";
import {Routable} from "./classes/routable";

export abstract class App extends Routable<express.Application> {
  public static path: string = '/';
  public static host: string = 'localhost';
  public static port: number;
  public static auto_start: boolean;

  public get_static(): typeof App {
    // @ts-ignore
    return this.constructor;
  }

  constructor() {
    super(express());
    const self = this.get_static();

    if (self.auto_start) {
      if (!self.port) {
        throw new Error('Port number in not defined!');
      }
      this.start_app();
    }
  }

  remove_layers(): void {
    this.get_routable()._router.stack.splice(2);
  }

  start_app () {
    const self = this.get_static();

    const next_layer: Routable<any>[] = [ this ];

    while (next_layer.length) {
      next_layer
        .splice(0)
        .forEach(e => {
          e.setup_layers();
          next_layer.push(...e.children_routable)
        });
    }

    this.routable_object.listen(self.port, self.host, () => console.log(`App is active: http://${self.host}:${self.port}`));
  }
}
