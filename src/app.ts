import express, { Application } from "express";
import { Server } from "node:http";
import { Routable } from "./classes/routable";

export abstract class App extends Routable<Application> {
  public path: string = '/';
  public host: string = 'localhost';
  public port: number = -1;
  protected running_server: Server | undefined;
  protected _start_stop_logging = true;

  constructor() {
    super(express());
    this.running_server = undefined;
  }

  set start_stop_logging (value: boolean) {
    this._start_stop_logging = value;
  }

  remove_layers(): void {
    this.get_routable()._router.stack.splice(2);
  }

  start_app () {
    if (!this.layers_initialized) {
      this.setup_layers();
    }

    this.running_server = this.routable_object.listen(
      this.port,
      this.host,
      () => {
        if (this._start_stop_logging) {
          console.log(`App is active: http://${this.host}:${this.port}`);
        }
      });
  }

  stop (on_stop_callback: () => any = () => {}) {
    if (this.running_server) {
      this.running_server.close(() => {
        delete this.running_server;
        if (this._start_stop_logging) {
          console.log(`Server stopped listening to http://${this.host}:${this.port}`);
        }
        on_stop_callback();
      });
    }
  }
}
