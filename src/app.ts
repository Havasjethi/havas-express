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

    // @ts-ignore
    this.setup_methods();

    if (self.auto_start) {
      if (!self.port) {
        throw new Error('Port number in not defined!');
      }
      this.start_app();
    }
  }

  start_app () {
    const self = this.get_static();

    this.routable_object.listen(self.port, self.host, () => console.log(`App is active: http://${self.host}:${self.port}`));
  }
}
