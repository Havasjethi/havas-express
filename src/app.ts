import express from "express";
import {MethodHolder} from "./classes/method_holder";
import {Routable} from "./classes/routable";
import {MethodEntry} from "./interfaces/method_entry";

export abstract class App extends Routable<express.Application> {
  public static path: string = '/';
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
    // self.methods.forEach((e: MethodEntry) => this.routable_object[e.http_method](e.path, this[e.object_method]));
    this.setup_methods();

    if (self.auto_start) {
      if (!self.port) {
        throw new Error('Port number in not defined!');
      }

      // @ts-ignore
      this.routable_object.listen(self.port, self.host, () => console.log(`App is active: http://${self.host}:${self.port}`));
    }
  }
}
