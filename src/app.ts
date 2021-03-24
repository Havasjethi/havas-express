import express from "express";
import {ExpressHttpMethod} from "./types/native_http_methods";

interface MethodEntry {
  http_method: string;
  object_method: string;
  path: string;
}

export abstract class MethodHolder {
  public static path: string = '/';
  public static methods: MethodEntry[] = [];

  public static add_method (method_name: string, http_method: ExpressHttpMethod, path: string = '/'): typeof MethodHolder {
    this.methods.push({
      object_method: method_name,
      http_method,
      path
    });

    return this;
  }

  public static set_path (path: string) {
    this.path = path;
    return this;
  }

  public get_static(): typeof MethodHolder {
    // @ts-ignore
    return this.constructor;
  }
}

export abstract class App extends MethodHolder {
  // @ts-ignore
  public express_app: express.Application;
  public static path: string = '/';
  public static port: number;
  public static auto_start: boolean;

  public get_static(): typeof App {
    // @ts-ignore
    return this.constructor;
  }

  constructor() {
    super();
    const self = this.get_static();

    this.express_app = express();

    console.log(self.methods);
    // @ts-ignore
    self.methods.forEach((e: MethodEntry) => this.express_app[e.http_method](e.path, this[e.object_method]);

    if (self.auto_start) {
      if (!self.port) {
        throw new Error('Port number in not defined!');
      }

      this.express_app.listen(self.port, self.host, () => console.log(`App is active: http://${self.host}:${self.port}`));
    }
  }

  get_application (): express.Application {
    return this.express_app;
  }
}
