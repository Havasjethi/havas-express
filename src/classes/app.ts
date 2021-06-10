import express, { Application } from "express";
import { createServer as createHttpServer, ServerOptions as HttpServerOptions } from 'http';
import { createServer as createHttpsServer, ServerOptions as HttpsServerOptions } from 'https';
import { AddressInfo, ListenOptions, Server } from "net";
import { Routable } from "./routable";


const SimpleIdGenerator = new class {
  private next_id: number = 1;

  public get_id (): number {
    return this.next_id++;
  }
};


export interface ServerListenOptions {
  listen_options?: ListenOptions,
  https?: boolean,
  server_options?: HttpServerOptions | HttpsServerOptions,
  start_callback?: (server: Server) => void,
}


export abstract class App extends Routable<Application> {
  public options: ListenOptions = {};
  protected default_server: Server | undefined;
  protected started_servers: { id: number, server: Server }[];
  protected _start_stop_logging = true;

  constructor () {
    super(express());
    this.default_server = undefined;
    this.started_servers = [];
  }

  public set start_stop_logging (value: boolean) {
    this._start_stop_logging = value;
  }

  public remove_layers (): void {
    this.get_routable()._router.stack.splice(2);
  }

  public start_app (callback: ((created_server: Server) => void) | undefined = undefined) {
    if (!this.layers_initialized) {
      this.setup_layers();
    }

    if (this.default_server && this.default_server.listening) {
      throw new Error('Default server is already active, cannot be started again!');
    }

    this.default_server = createHttpServer(this.routable_object);
    this.default_server.listen(
      this.options,
      () => {
        let { port: listening_port } = this.default_server!.address() as AddressInfo;
        const host = this.options.host ?? 'localhost';
        const port = listening_port === 80 ? '' : `:${ listening_port }`;

        console.log(`App is active: http://${ host }${ port }/`);

        if (callback && this.default_server) {
          callback(this.default_server);
        }
      });
  }

  public listen ({ listen_options, server_options, https, start_callback }: ServerListenOptions): number {
    if (!https) {
      https = false;
    }

    if (!this.layers_initialized) {
      this.setup_layers();
    }

    const server = https
      ? createHttpsServer(server_options ?? {}, this.routable_object)
      : createHttpServer(server_options ?? {}, this.routable_object);

    server.listen(Object.assign(this.options, listen_options ?? {}), () => {
      if (start_callback) {
        start_callback(server);
      } else {
        const protocol = `http${ https ? 's' : '' }`;
        const host = listen_options?.host ?? 'localhost';
        const used_port = (server.address() as AddressInfo).port;
        const port = https && used_port === 443 || !https && used_port === 80 ? '' : `:${ used_port }`;

        const path = `${ protocol }://${ host }${ port }/`;
        console.log(`App started to listend on: ${ path }`, server.address());
      }
    });

    const id = SimpleIdGenerator.get_id();
    this.started_servers.push({ server, id });

    return id;
  }

  public stop_one (server_id: number, error_hander?: (err: Error | undefined) => void) {
    const server_index = this.started_servers.findIndex(e => e.id === server_id);
    if (server_index < 0) {
      throw new Error('Id not found');
    }
    const server = this.started_servers.splice(server_index, 1)[0].server;
    server.close(error_hander);
  }

  public stop_all (error_hander?: (err: Error | undefined) => void) {
    this.started_servers.splice(0).map(({ server }) => server.close(error_hander));
  }

  /**
   * Stops the default server
   * @param {() => any} on_stop_callback
   */
  public stop (on_stop_callback: () => any = () => {}) {
    if (this.default_server) {
      this.default_server.close(() => {
        delete this.default_server;
        if (this._start_stop_logging) {
          console.log(`Server stopped listening to http://${ this.options.host }:${ this.options.port }`);
        }
        on_stop_callback();
      });
    }
  }
}
