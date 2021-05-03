import {MethodHolder} from "./method_holder";
import {
  MethodEntry, MethodParameterData,
  MethodParameterEntry, MethodParameterType,
  Middleware,
  MiddlewareFunction
} from "../interfaces/method_entry";
import {ExpressHttpMethod} from "../types/native_http_methods";
import {ExpressRequest, ExpressResponse} from "../../index";
import {IRouter} from "express";

export type ExpressRoutable = IRouter;

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

  protected methods: { [method_name: string]: MethodEntry };
  protected method_parameters: { [method_name: string]: MethodParameterEntry<any>[] };

  protected constructor(routable_object: T) {
    super();
    this.routable_object = routable_object;

    //@ts-ignore
    if (!this.methods) {
      this.methods = {};
    }

    //@ts-ignore
    if (!this.method_parameters) {
      this.method_parameters = {};
    }
  }

  public abstract remove_layers(): void;

  protected initialize() {
    if (!this.methods) {
      this.methods = {};
    }
    if (!this.method_parameters) {
      this.method_parameters = {};
    }
  }

  public add_method(method_name: string, http_method: ExpressHttpMethod, path: string = '/', middlewares: Middleware[] = []) {
    this.initialize();
    const method_entry: MethodEntry = {
      object_method: method_name,
      http_method,
      path,
      middlewares,
      method_parameters: this.method_parameters[method_name] ?? [],
    };

    if (this.methods[method_name]) {
      throw new Error('Method is already added, Modify instead recreation.');
    }

    this.methods[method_name] = method_entry;

    return this;
  }

  /**
   * TODO :: Add juicy stuff ( Generic + Optional types )
   *
   * @param method_name
   * @param parameter_type
   * @param index
   * @param extra_data
   */
  public add_method_parameter<T extends MethodParameterType>(
    method_name: string,
    parameter_type: T,
    index: number,
    extra_data: MethodParameterData|undefined = undefined
  ) {
    this.initialize();

    if (!this.method_parameters[method_name]) {
      this.method_parameters[method_name] = [];
    }

    this.method_parameters[method_name].push({
      parameter_index: index,
      parameter_type,
      extra_data
    });
  }


  public get_routable(): T {
    return this.routable_object;
  };

  public add_constructor_middleware(middleware: RegistrableMiddleware) {
    this.middlewares.push(middleware);
  }

  public get_path(): string {
    return this.path;
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

  get_added_methods(): MethodEntry[] {
    return Object.values(this.methods);
  }

  /**
   * Add endpoints
   */
  public setup_layers(): void {
    this.setup_middlewares(this.middlewares);
    this.setup_methods(this.get_added_methods());
  }

  protected setup_middlewares(middlewares: RegistrableMiddleware[]): void {
    middlewares.forEach(e => e.method !== undefined
      ? this.get_routable()[e.method](e.path, ...e.middleware_functions)
      : this.get_routable().use(e.path, ...e.middleware_functions)
    );
  }

  protected setup_methods(added_methods: MethodEntry[]): void {

    this.get_added_methods().forEach((e: MethodEntry) => {
      this.routable_object[e.http_method](
        e.path,
        ...(e.middlewares.map((middleware: Middleware) => typeof middleware === 'function'
          ? middleware
          : middleware.handle.bind(middleware))), // VS  (req: any, res: any, next: any) => middleware.handle(req, res, next))),
        this.method_creator(e))
    });
  }

  /**
   * Creates callable method for the endpoint
   * TODO :: Minimize overhead
   * @param e
   * @protected
   */
  protected method_creator (e: MethodEntry): any {
    return (req: ExpressRequest, res: ExpressResponse, next: CallableFunction) => {
      const parameters: any[] = [];

      if (e.method_parameters.length === 0) {
        parameters.push(req, res, next);
      } else {
        // TODO :: Parameter placement ? What if the first parameter is not 0.th
        e.method_parameters.sort((a,b) => a.parameter_index > b.parameter_index ? 1 : -1);

        if (e.method_parameters[0].parameter_index !== 0) {
          throw new Error('What should I do here?? Pass Request, Response, Next, All-of-them ?');
        }

        e.method_parameters.forEach((parameter: MethodParameterEntry<any>) => {
          switch (parameter.parameter_type) {
            case "request":
              parameters.push(req);
              return;

            case "response":
              parameters.push(res);
              return;

            case "next":
              parameters.push(next);
              return;
          }

          if (!parameter.extra_data) {
            throw new Error('extra_data should be defined here || Return undefined? ');
          }

          switch (parameter.parameter_type) {
            case "path":
              parameters.push(req.params[parameter.extra_data.variable_path]);
              break;
            case "query":
              parameters.push(req.query[parameter.extra_data.variable_path]);
              break;
            case "body":
              parameters.push(req.body[parameter.extra_data.variable_path]);
              break;
            case "parameter":
              parameters.push(req.params[parameter.extra_data.variable_path]);
              break;
          }
        });
      }

      //@ts-ignore
      this[e.object_method](...parameters);
    };
  }
}
