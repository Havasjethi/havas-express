import {
  MethodEntry,
  MethodParameterData,
  MethodParameterEntry,
  MethodParameterType,
  Middleware,
  MiddlewareFunction
} from "../interfaces/method_entry";
import { ExpressHttpMethod } from "../types/native_http_methods";
import { ExpressRequest, ExpressResponse } from "../../index";
import { IRouter } from "express";

export type ExpressRoutable = IRouter;

interface RegistrableMiddleware {
  path: string;
  method?: ExpressHttpMethod;
  middleware_functions: MiddlewareFunction[];
}

export interface ResultWrapperParameters {
  result: any;
  request: ExpressRequest;
  response: ExpressResponse;
  next: Function;
}

export abstract class Routable<T extends ExpressRoutable = IRouter> {
  public routable_object: T;
  public path: string = '/';
  public children_routable: Routable<any>[] = [];
  public parent: Routable<any> | null = null;
  protected layers_initialized: boolean = false;
  protected middlewares: RegistrableMiddleware[] = [];

  protected result_wrapper: ((o: ResultWrapperParameters) => any) | null = null;

  // TODO :: Refactor this later
  protected methods: { [method_name: string]: MethodEntry } = {};
  protected method_parameters: { [method_name: string]: MethodParameterEntry<any>[] } = {};

  protected constructor(routable_object: T) {
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


  public set_result_wrapper(wrapper_function: Routable<any>['result_wrapper']) {
    this.result_wrapper = wrapper_function;
  }

  public get_result_wrapper(): Routable<any>['result_wrapper'] {
    return this.result_wrapper ?? this.parent?.get_result_wrapper() ?? null;
  }

  protected get_method_entry (method_name: string): MethodEntry {
    if (!this.methods[method_name]) {
      this.methods[method_name] = {
        middlewares: [],
        preprocessor_parameter: [],
        post_processor_parameters: [],
      };
    }

    return this.methods[method_name];
  }

  public add_method<T extends ThisType<this>>(method_name: keyof T & string, http_method: ExpressHttpMethod, path: string = '/', middlewares: Middleware[] = []) {
    const method_entry = this.get_method_entry(method_name);
    method_entry.object_method_name = method_name;
    //@ts-ignore
    method_entry.object_method_name = this.method_name;
    method_entry.http_method = http_method;
    method_entry.path = path;
    method_entry.middlewares.push(...middlewares);
    method_entry.use_wrapper = true; // Todo :: Is it possible to guess the user's behaviour?

    return this;
  }

  public add_request_preporecssor<T extends MethodParameterType>(
    method_name: string,
    parameter_type: T,
    index: number,
    extra_data: MethodParameterData | undefined = undefined
  ) {
    const method_entry = this.get_method_entry(method_name);
    method_entry.preprocessor_parameter.push({
      parameter_index: index,
      parameter_type,
      extra_data
    });
  }

  public add_request_postporecssor<T extends MethodParameterType>(
    method_name: string,
    parameter_type: T,
    index: number,
    extra_data: MethodParameterData | undefined = undefined
  ) {
    const method_entry = this.get_method_entry(method_name);
    method_entry.post_processor_parameters.push({
      parameter_index: index,
      parameter_type,
      extra_data
    });
  }

  public get_routable(): T {
    return this.routable_object;
  };

  public get_initialized_routable(): T {
    if (!this.layers_initialized) {
      this.setup_layers();
    }

    return this.routable_object;
  }

  public add_constructor_middleware(middleware: RegistrableMiddleware) {
    this.middlewares.push(middleware);
  }

  public get_path(): string {
    return this.path;
  }

  public append<T extends ExpressRoutable>(other: Routable<T>): this {
    this.children_routable.push(other);
    other.parent = this;

    return this;
  }

  public append_to<T extends ExpressRoutable>(container: Routable<T>): this {
    container.append(this);

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
    this.setup_methods(this.get_added_methods() as Required<MethodEntry>[]);
    this.children_routable.forEach((child: Routable<ExpressRoutable>) => {
      if (!child.layers_initialized) {
        child.setup_layers();
      }

      this.get_routable().use(child.get_path(), child.get_routable())
    });
    this.layers_initialized = true;
  }

  protected setup_middlewares(middlewares: RegistrableMiddleware[]): void {
    const routable = this.get_routable();
    middlewares.forEach(e => e.method !== undefined
      ? routable[e.method](e.path, ...e.middleware_functions)
      : routable.use(e.path, ...e.middleware_functions)
    );
  }

  protected setup_methods(methods: Required<MethodEntry>[]): void {

    // this.get_added_methods()
    methods.forEach((e) => {
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
  protected method_creator(e: Required<MethodEntry>): any {
    return (request: ExpressRequest, response: ExpressResponse, next: CallableFunction) => {
      const parameters: any[] = [];

      if (e.preprocessor_parameter.length === 0) {
        parameters.push(request, response, next);
      } else {
        // TODO :: Parameter placement ? What if the first parameter is not 0.th
        e.preprocessor_parameter.sort((a, b) => a.parameter_index > b.parameter_index ? 1 : -1);

        if (e.preprocessor_parameter[0].parameter_index !== 0) {
          throw new Error('What should I do here?? Pass Request, Response, Next, All-of-them ?');
        }

        e.preprocessor_parameter.forEach((parameter: MethodParameterEntry<any>) => {
          switch (parameter.parameter_type) {
            case "request":
              parameters.push(request);
              return;

            case "response":
              parameters.push(response);
              return;

            case "next":
              parameters.push(next);
              return;
          }

          if (!parameter.extra_data) {
            throw new Error('extra_data should be defined here || Return undefined? ');
          }

          const add_parameter = (value: any) => {
            // TODO :: Call post processors
            parameters.push(value);
          }

          switch (parameter.parameter_type) {
            case "path":
            case "parameter":
              add_parameter(request.params[parameter.extra_data.variable_path]);
              break;

            case "query":
              add_parameter(request.query[parameter.extra_data.variable_path]);
              break;

            case "body":
              add_parameter(
                parameter.extra_data.variable_path === ''
                  ? request.body
                  : request.body[parameter.extra_data.variable_path]
              );
              break;

            case "cookie":
              add_parameter(request.cookies[parameter.extra_data.variable_path]);
              // TODO :: How to tell the difference?
              // parameters.push(request.signedCookies[parameter.extra_data.variable_path]);
              break;
          }
        });
      }

      const wrapper = this.get_result_wrapper();

      //@ts-ignore
      const result = this[e.object_method_name](...parameters);

      if (wrapper && !response.headersSent) { // What happens if they call the next function
        wrapper({result, request, response, next});
      }
    };
  }
}
