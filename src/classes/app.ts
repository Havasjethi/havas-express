import express, { Application } from "express";
import { Server } from "node:http";
import { Routable } from "./routable";
import { ListenOptions } from "node:net";

export abstract class App extends Routable<Application> {
  public options: ListenOptions = {};
  protected running_server: Server | undefined;
  protected _start_stop_logging = true;

  constructor() {
    super(express());
    this.running_server = undefined;
  }

  public set start_stop_logging (value: boolean) {
    this._start_stop_logging = value;
  }

  public remove_layers(): void {
    this.get_routable()._router.stack.splice(2);
  }

  public start_app (callback: ((created_server: Server) => void) | undefined = undefined) {
    if (!this.layers_initialized) {
      this.setup_layers();
    }

    this.running_server = this.routable_object.listen(
      this.options,
      () => {
        console.log(`App is active: http://${this.options.host}:${this.options.port}`);
        if (callback && this.running_server) {
          callback(this.running_server);
        }
      });
  }

  public stop (on_stop_callback: () => any = () => {}) {
    if (this.running_server) {
      this.running_server.close(() => {
        delete this.running_server;
        if (this._start_stop_logging) {
          console.log(`Server stopped listening to http://${this.options.host}:${this.options.port}`);
        }
        on_stop_callback();
      });
    }
  }
}
