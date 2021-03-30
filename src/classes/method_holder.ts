import {ExpressHttpMethod} from "../types/native_http_methods";
import express, {IRouter} from "express";
import {MethodEntry, Middleware} from "../interfaces/method_entry";

// export type ExpressRoutable = express.Router | express.Application;
export type ExpressRoutable = IRouter;

export abstract class MethodHolder {
  private static methods: {[class_name: string]: MethodEntry[]} = {};

  /**
   * @param method_name - PropertyKey
   * @param http_method - Get / Post / ..
   * @param path - Relative path to Routable
   * @param middlewares
   */
  public static add_method(method_name: string, http_method: ExpressHttpMethod, path: string = '/', middlewares: Middleware[] = []): typeof MethodHolder {
    const class_name = this.name;
    const method_entry: MethodEntry = {
      object_method: method_name,
      http_method,
      path,
      middlewares,
    };

    if (!this.methods[class_name]) {
      this.methods[class_name] = [];
    }

    this.methods[class_name].push(method_entry);

    return this;
  }

  public get_added_methods(): MethodEntry[] {
    const self = this.get_static();
    return self.methods[self.name] ?? [];
  }

  public get_static(): typeof MethodHolder {
    // @ts-ignore
    return this.constructor;
  }
}
