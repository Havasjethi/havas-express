import {ExpressHttpMethod} from "../types/native_http_methods";
import express from "express";
import {MethodEntry} from "../interfaces/method_entry";

export type ExpressRoutable = express.Router | express.Application;

export abstract class MethodHolder {
  private static methods: {[class_name: string]: MethodEntry[]} = {};

  /**
   * @param method_name - PropertyKey
   * @param http_method - Get / Post / ..
   * @param path - Relative path to Routable
   */
  public static add_method(method_name: string, http_method: ExpressHttpMethod, path: string = '/'): typeof MethodHolder {
    const class_name = this.name;
    const method_entry: MethodEntry = {
      object_method: method_name,
      http_method,
      path
    };

    if (!this.methods[class_name]) {
      this.methods[class_name] = [];
    }

    this.methods[class_name].push(method_entry);

    return this;
  }

  public get_added_methods(): MethodEntry[] {
    const self = this.get_static();
    return self.methods[self.name];
  }

  public get_static(): typeof MethodHolder {
    // @ts-ignore
    return this.constructor;
  }
}
