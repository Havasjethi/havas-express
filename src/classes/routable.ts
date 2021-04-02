import {ExpressRoutable, MethodHolder} from "./method_holder";
import {MethodEntry, Middleware, MiddlewareFunction} from "../interfaces/method_entry";
import {ExpressHttpMethod} from "../types/native_http_methods";

interface RegistrableMiddleware {
  path: string;
  method?: ExpressHttpMethod;
  middleware_functions: MiddlewareFunction[];
}

export abstract class Routable<T extends ExpressRoutable> extends MethodHolder {
  public routable_object: T;
  public path: string = '/';
  public children_routable: Routable<any>[] = [];
  protected middlewares: RegistrableMiddleware[] = [];

  public abstract remove_layers(): void;

  public get_routable(): T {
    return this.routable_object;
  };

  public add_constructor_middleware (middleware: RegistrableMiddleware) {
    this.middlewares.push(middleware);
    console.log(this.middlewares);
  }

  public get_path(): string {
    return this.path;
  }

  protected constructor(routable_object: T) {
    super();
    this.routable_object = routable_object;
  }

  public append<T extends ExpressRoutable>(other: Routable<T>): this {
    this.children_routable.push(other);

    // @ts-ignore
    this.get_routable().use(
      other.get_path(),
      other.get_routable()
    );

    return this;
  }

  public append_to<T extends ExpressRoutable>(path: string, container: Routable<T>): this {
    container.get_routable().use(container.get_routable());

    return this;
  }

  public set_path(path: string): this {
    this.path = path;
    return this;
  }

  /**
   * Add endpoints
   */
  public setup_methods(): void {
    this.middlewares.forEach(e => e.method !== undefined
      ? this.get_routable()[e.method](e.path, ...e.middleware_functions)
      : this.get_routable().use(e.path, ...e.middleware_functions)
    );

    this.get_added_methods().forEach((e: MethodEntry) => {
      // @ts-ignore
      this.routable_object[e.http_method](
        e.path,
        // @ts-ignore
        ...(e.middlewares.map((middleware: Middleware) => typeof middleware === 'function'
          ? middleware
          : middleware.handle.bind(middleware))), // VS  (req: any, res: any, next: any) => middleware.handle(req, res, next))),
        // @ts-ignore
        (...args) => this[e.object_method](...args))
    });
  }
}
