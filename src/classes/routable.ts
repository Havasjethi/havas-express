import { Application, ErrorRequestHandler, IRouter } from "express";
import { ExpressRequest, ExpressResponse, MiddlewareObject, Next } from "../../index";
import {
  MethodEntry,
  MethodParameterData,
  MethodParameterEntry,
  MethodParameterType,
  Middleware,
  MiddlewareFunction,
  PostProcessorType,
} from "../interfaces/method_entry";
import { ParameterExtractorStorage } from '../parameter_decorator/parameter_exctractor_storage';
import { ExpressHttpMethod } from "../types/native_http_methods";
import { ErrorHanderParams, ErrorHandlerClass } from "./error_handler";


export type ExpressRoutable = IRouter;


interface RegistrableMiddleware {
  path: string;
  method?: ExpressHttpMethod;
  middlewares: Middleware[];
}


export interface ResultWrapperParameters {
  result: any;
  request: ExpressRequest;
  response: ExpressResponse;
  next: Function;
}


export type ErrorHandlerShort = ((o: ErrorHanderParams) => unknown);
export type ErrorHandler = ErrorHandlerClass | ErrorRequestHandler | ErrorHandlerShort;


export enum ErrorHandlerType {
  ErrorHandlerClass,
  ErrorRequestHandler,
  ErrorHandlerShort
}


type ErrorHandlerEntry = { handler: ErrorHandler, type: ErrorHandlerType };


export abstract class Routable<T extends ExpressRoutable = IRouter> {
  public routable_object: T;
  public path: string = '/';
  public children_routable: Routable<any>[] = [];
  public parent: Routable<any> | null = null;

  protected layers_initialized: boolean = false;
  protected middlewares: RegistrableMiddleware[] = [];
  protected error_handlers: ErrorHandlerEntry[] = [];
  protected default_handler: MiddlewareFunction | undefined;
  protected result_wrapper: ((o: ResultWrapperParameters) => any) | null = null;
  protected methods: { [method_name: string]: MethodEntry } = {};
  protected method_parameters: { [method_name: string]: MethodParameterEntry<any>[] } = {};

  protected constructor (
    routable_object: T,
    protected type: 'router' | 'app',
  ) {
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

  public abstract remove_layers (): void;

  public get locals (): Application['locals'] {
    if (this.type === 'router') {
      return this.parent!.locals;
    } else {
      return (<Application><unknown>this.get_routable()).locals;
    }
  }

  public get_local<Result = any> (key: string): Result | undefined {
    let starting_element: Routable = this;

    do {
      if (starting_element.type === 'app') {
        const value = (<Application><unknown>starting_element.get_routable()).locals[key];

        if (value) {
          return value;
        }
      }

      starting_element = starting_element.parent!;
    } while (this.parent);

    return undefined;
  }


  public set_result_wrapper (wrapper_function: Routable<any>['result_wrapper']) {
    this.result_wrapper = wrapper_function;
  }

  public get_result_wrapper (): Routable<any>['result_wrapper'] {
    return this.result_wrapper ?? this.parent?.get_result_wrapper() ?? null;
  }

  protected get_method_entry (method_name: string): MethodEntry {
    if (!this.methods[method_name]) {
      this.methods[method_name] = {
        middlewares: [],
        preprocessor_parameter: [],
        post_processors: {},
        parameter_extractors: [],
      };
    }

    return this.methods[method_name];
  }

  public set_default_handler<Ext extends Routable> (method_name: keyof Ext): this {
    //@ts-ignore
    this.default_handler = this[method_name];
    return this;
  }

  public add_method<T extends ThisType<this>> (
    method_name: keyof T & string,
    http_method: ExpressHttpMethod,
    path: string = '/',
    middlewares: Middleware[] = [],
  ): this {
    const method_entry = this.get_method_entry(method_name);
    method_entry.object_method_name = method_name;
    //@ts-ignore
    method_entry.object_method = this[method_name];
    method_entry.http_method = http_method;
    method_entry.path = path;
    method_entry.middlewares.push(...middlewares);
    method_entry.use_wrapper = true; // Todo :: Is it possible to guess the user's behaviour?

    return this;
  }


  public add_parameter_extractor<T extends MethodParameterType> (
    method_name: string,
    parameter_index: number,
    extractor_name: string, // How can I make this into a Type?
    args: any
  ) {
    this.get_method_entry(method_name)
      .parameter_extractors.push({
      parameter_index,
      extractor_name,
      arguments: args,
    });
  }

  public add_request_preporecssor<T extends MethodParameterType> (
    method_name: string,
    parameter_type: T,
    index: number,
    extra_data: MethodParameterData | undefined = undefined,
  ) {
    const method_entry = this.get_method_entry(method_name);
    method_entry.preprocessor_parameter.push({
      parameter_index: index,
      parameter_type,
      extra_data,
    });
  }

  public add_request_postprocessor<T extends PostProcessorType = PostProcessorType> (
    method_name: string,
    index: number,
    post_processor: T,
  ) {
    const method_entry = this.get_method_entry(method_name);
    const parameter_post_processors = method_entry.post_processors[index]
      ? method_entry.post_processors[index]
      : method_entry.post_processors[index] = [];

    parameter_post_processors.push(post_processor);
  }

  public get_routable (): T {
    return this.routable_object;
  };

  public get_initialized_routable (): T {
    if (!this.layers_initialized) {
      this.setup_layers();
    }

    return this.routable_object;
  }

  public add_constructor_middleware (middleware: RegistrableMiddleware) {
    this.middlewares.push(middleware);
  }

  add_error_handler (error_handler: ErrorHandler) {
    const type = typeof error_handler === 'function'
      ? ErrorHandlerType.ErrorRequestHandler
      : ErrorHandlerType.ErrorHandlerClass;

    this.error_handlers.push({
      handler: error_handler,
      type,
    });
  }

  add_error_handler_method<Child extends this> (error_handler_method_name: keyof Child) {
    //@ts-ignore
    const handler = this[error_handler_method_name];
    this.error_handlers.push({
      handler,
      type: handler.length === 1 ? ErrorHandlerType.ErrorHandlerShort : ErrorHandlerType.ErrorRequestHandler,
    });
  }

  public get_path (): string {
    return this.path;
  }

  public append<T extends ExpressRoutable> (other: Routable<T>): this {
    this.children_routable.push(other);
    other.parent = this;

    return this;
  }

  public append_to<T extends ExpressRoutable> (container: Routable<T>): this {
    container.append(this);

    return this;
  }

  public set_path (path: string): this {
    this.path = path;
    return this;
  }

  get_added_methods (): MethodEntry[] {
    return Object.values(this.methods);
  }

  /**
   * Add endpoints
   */
  public setup_layers (): void {
    this.setup_middlewares(this.middlewares);
    this.setup_methods(this.get_added_methods() as Required<MethodEntry>[]);
    this.children_routable.forEach((child: Routable<ExpressRoutable>) => {
      if (!child.layers_initialized) {
        child.setup_layers();
      }

      this.get_routable().use(child.get_path(), child.get_routable());
    });

    this.setup_default_handler();
    this.setup_error_handlers(this.error_handlers);

    this.layers_initialized = true;
  }

  protected setup_middlewares (middlewares: RegistrableMiddleware[]): void {
    const routable = this.get_routable();

    const middleware_mapper = (middlewares: Middleware[]): MiddlewareFunction[] =>
      middlewares.map(e => {
        if (typeof e === 'function') {
          return e;
        } else {
          return (e as MiddlewareObject).handle.bind(e);
        }
      });

    middlewares.forEach(e => {
      const functions: MiddlewareFunction[] = middleware_mapper(e.middlewares);
      e.method !== undefined
        ? routable[e.method](e.path, ...functions)
        : routable.use(e.path, ...functions);
    });
  }

  protected setup_default_handler (): void {
    if (!this.default_handler) {
      return;
    }

    this.get_routable().use(this.default_handler.bind(this));
  }

  protected setup_error_handlers (error_handlers: ErrorHandlerEntry[]): void {
    const routable = this.get_routable();
    error_handlers.forEach(({ handler, type }) => {
      if (type === ErrorHandlerType.ErrorHandlerShort) {
        routable.use((error: Error, request: ExpressRequest, response: ExpressResponse, next: Function) =>
          (handler as ErrorHandlerShort)({ error, request, response, next }));
      } else if (type === ErrorHandlerType.ErrorHandlerClass) {
        routable.use((error: Error, request: ExpressRequest, response: ExpressResponse, next: Function) =>
          (handler as ErrorHandlerClass).handle({ error, request, response, next }));
      } else if (type === ErrorHandlerType.ErrorRequestHandler) {
        routable.use((handler as ErrorRequestHandler));
      }
    });
  }

  protected setup_methods (methods: Required<MethodEntry>[]): void {
    methods.forEach((e) => {
      this.routable_object[e.http_method](
        e.path,
        ...(e.middlewares.map((middleware: Middleware) => typeof middleware === 'function'
          ? middleware
          : middleware.handle.bind(middleware))), // VS  (req: any, res: any, next: any) => middleware.handle(req, res, next))),
        this.method_creator(e));
    });
  }

  /**
   * Creates callable method for the endpoint
   * TODO :: Minimize overhead
   *
   * @param e
   * @protected
   */
  protected method_creator (e: Required<MethodEntry>): any {
    const wrapper = this.get_result_wrapper();

    return (request: ExpressRequest, response: ExpressResponse, next: Next) => {
      const parameters: any[] = [];

      if (e.parameter_extractors.length === 0 && Object.keys(e.post_processors).length === 0) {
        parameters.push(request, response, next);
      } else {
        e.parameter_extractors.sort((a, b) => a.parameter_index > b.parameter_index ? 1 : -1);

        const add_parameter = (value: any, index: number) => {
          console.log(value);
          e.post_processors[index]?.forEach(post_processor => {
            const rv = post_processor(value);
            value = rv != undefined ? rv : value;
          });

          parameters.push(value);
        }

        e.parameter_extractors.forEach((value, index) => {
          add_parameter(
            ParameterExtractorStorage.get_parameter_extractor(value.extractor_name)(value.arguments, request, response, next),
            index
          );
        })
      }

      const result = e.object_method.bind(this)(...parameters);

      if (wrapper && !response.headersSent) { // What happens if they call the next function
        if (result.constructor.name === 'Promise') {
          result
            .then((result: any) => wrapper({ result, request, response, next }))
            .catch((e: any) => next(e));
        } else {
          wrapper({ result, request, response, next });
        }
      }
    };
  }

}
