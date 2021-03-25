import {ExpressHttpMethod} from "../types/native_http_methods";
import express from "express";

export type ExpressRoutable = express.Router | express.Application;

export interface MethodEntry {
  http_method: string; // keyof ExpressRouter
  object_method: string; // keyof <Current Object?>
  path: string;
}

export abstract class MethodHolder {
  public static methods: MethodEntry[] = [];

  /**
   * @param method_name - PropertyKey
   * @param http_method - Get / Post / ..
   * @param path - Relative path to Routable
   */
  public static add_method(method_name: string, http_method: ExpressHttpMethod, path: string = '/'): typeof MethodHolder {
    this.methods.push({
      object_method: method_name,
      http_method,
      path
    });

    return this;
  }

  public get_static(): typeof MethodHolder {
    // @ts-ignore
    return this.constructor;
  }
}

export abstract class Routable<T extends ExpressRoutable> extends MethodHolder {
  public routable_object: T;
  public path: string = '/';

  public get_routable(): T {
    return this.routable_object;
  };

  public get_path (): string {
    return this.path;
  }

  protected constructor(routable_object: T) {
    super();
    this.routable_object = routable_object;
  }

  public append<T extends ExpressRoutable> (other: Routable<T>) {
    // @ts-ignore
    this.get_routable().use(
      other.get_path(),
      other.get_routable()
    );
  }

  public append_to<T extends ExpressRoutable> (path: string, container: Routable<T>): this {
    container.get_routable().use(container.get_routable());

    return this;
  }

  public set_path(path: string): this {
    this.path = path;
    return this;
  }

  protected map_methods () {
    // TODO :: Resolve problem:
    //  - Both App & Router has the same methods
    //  - ?Remove static
    console.log(`Construcor: ${this.constructor}`, this.get_static().methods);
    // this.get_static().methods.forEach((e: MethodEntry) => {
    //   // @ts-ignore
    //   this.routable_object[e.http_method](e.path, this[e.object_method])
    // });
  }
}
