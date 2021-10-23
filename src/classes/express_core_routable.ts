import { ErrorRequestHandler, IRouter, Errback } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { BaseCoreRouter, DecoratedParameters, Objectified, RegistrableMethod } from 'havas-core';
import {
  DynamicParameterExctractorFunction,
  ExpressRequest,
  ExpressResponse,
  Next,
  ParameterExtractorStorage,
  StaticParameterExctractorFunction,
} from '../../index';
import { ExpressHttpMethod } from '../types/native_http_methods';
import { ErrorHandlerClass, ErrorHandlerFunction } from './error_handler';
import { MiddlewareObject } from './middleware';
import { ExpressEndpoint, PostProcessor } from './types/endpoint';
import {
  ErrorHandlerEntry,
  ErrorHandlerShort,
  ErrorHandlerType,
  RegistreableErrorHandler,
} from './types/error';
import { Middleware, MiddlewareFunction, RegistrableMiddleware } from './types/middleware';
import { ResultWrapperType } from './types/result_wrapper';

//type Mapping<T> = errorHandlerMethods;

export abstract class ExpressCoreRoutable<T extends IRouter = IRouter> extends BaseCoreRouter<
  ExpressEndpoint,
  RegistrableMiddleware,
  ErrorHandlerEntry,
  ResultWrapperType
> {
  public routable: T;
  public layersInitialized: boolean = false;

  public errorHandlersMethods: { [name: string]: RegistreableErrorHandler } = {};

  public children: ExpressCoreRoutable[] = [];

  protected constructor(routable: T, protected type: 'router' | 'app') {
    super();
    this.routable = routable;
  }

  set_path(path: string) {
    return this.setPath(path);
  }

  /**
   * TODO Move method
   */
  public setPath(path: string): this {
    this.path = path;
    return this;
  }

  append(child: ExpressCoreRoutable) {
    return this.addChild(child);
  }

  getRoutable(): T {
    return this.routable;
  }

  // Registration methods

  private getEndpoint(name: string): ExpressEndpoint {
    if (this.endpoints[name] === undefined) {
      this.endpoints[name] = {
        postProcessors: [],
        methodName: name,
        middlewares: [],
        parameters: [],
        // methodType
        // methodName
        // path
      } as unknown as ExpressEndpoint;
    }

    return this.endpoints[name];
  }

  // private getErrorHandler(name: string): RegistreableErrorHandler {
  //   if (this.errorHandlersMethods[name] === undefined) {
  //     this.errorHandlersMethods[name] = {
  //       parameters: [],
  //       // TODO :: Should MethodName be added ?
  //     } as unknown as RegistreableErrorHandler;
  //   }
  //   return this.errorHandlersMethods[name];
  // }

  parameterExtractors: {[name: string | symbol | number]: DecoratedParameters[]} = {};

  public addParameterExtractor(
    methodName: string,
    parameterIndex: number,
    extractorName: string,
    argument?: any[],
  ) {
    if (!this.parameterExtractors[methodName]) {
      this.parameterExtractors[methodName] = [];
    }
    const extractor = this.parameterExtractors[methodName] ??= [];

    extractor.push({
      name: extractorName,
      index: parameterIndex,
      arguments: argument,
    });
  }



  public addRequestPostprocessor<T extends PostProcessor = PostProcessor>(
    methodName: string,
    index: number,
    post_processor: T,
  ) {
    const method_entry = this.getEndpoint(methodName);
    if (!method_entry.postProcessors[index]) {
      method_entry.postProcessors[index] = [];
    }

    method_entry.postProcessors[index].push(post_processor);
  }

  /**
   * Register endpoint method -- @Get, @Post...
   */
  public registerEndpoint(
    methodName: string,
    methodType: ExpressHttpMethod,
    path: string,
    middlewares: Middleware[],
  ) {
    const endpoint = this.getEndpoint(methodName);
    endpoint.methodType = methodType;
    endpoint.path = path;
    endpoint.middlewares.push(...middlewares);
    endpoint.parameters = this.parameterExtractors[methodName];
  }

  public add_constructor_middleware(middleware: RegistrableMiddleware) {
    this.middlewares.push(middleware);
  }

  public registerResultWrapperMethod(resultWrapperName: string) {
    // const x = this.getEndpoint(resultWrapperName);
    this.registerResultWrapper({
      methodName: resultWrapperName,
      parameters: [],
      postProcessors: {}
    });
  }

  errorHandlerFunctions: ErrorHandlerFunction[] = [];
  errorHandlerMethods: Objectified<RegistrableMethod> = {};

  public registerErrorHandlerFunction(errorHandler: ErrorHandlerFunction | ErrorHandlerClass): void{
    if (typeof errorHandler === 'object') {
      this.errorHandlerFunctions.push(
        (error, request, response, next) => (errorHandler as ErrorHandlerClass).handle({error, request, response, next})
        )
    } else if( typeof errorHandler === 'function'){
      this.errorHandlerFunctions.push(
        errorHandler
      )
    } else {
      console.error('Unable to register function: ', typeof errorHandler)
      throw new Error('Unable to register function');
    }
  }

  public registerErrorHandler(methodName: string) {
    this.errorHandlerMethods[methodName] = {methodName, parameters: this.parameterExtractors[methodName]};
  }

  defaultHandlerMethod?: ExpressEndpoint;
  defaultHandlerFunction?: MiddlewareFunction;

  public registerDefaultHandlerFunction(defaultHandler: MiddlewareFunction) {
    this.defaultHandlerFunction = defaultHandler;
  }
  
  public registerDefaultHandlerMethod(handlerName: string) {
    console.log('registerDefaultHandlerMethod')
    this.defaultHandlerMethod = {
      methodName: handlerName,
      name: handlerName,
      parameters: this.parameterExtractors[handlerName] ?? [],
      methodType: 'all',
      path: '*',
      middlewares: [],
      postProcessors: [],
    }
  }

  /**
   * @deprecated
   */
  get_initialized_routable(): T {
    return this.getInitializedRoutable();
  }

  getInitializedRoutable(): T {
    if (!this.layersInitialized) {
      this.setupLayers();
    }

    return this.getRoutable();
  }

  /**
   * Add endpoints
   */
  public setupLayers(): void {
    this.setupMiddlewares(this.middlewares);
    this.setupMethods(Object.values(this.endpoints));

    // TODO :: Add this pls: Initialize Result Wrapper Function for each nodes (Router) 
    // this.setupDefaultHandler(this.get_added_methods() as Required<MethodEntry>[]);

    this.children.forEach((child: ExpressCoreRoutable) => {
      console.log('called')
      if (!child.layersInitialized) {
        child.setupLayers();
      }

      this.getRoutable().use(child.path, child.getRoutable());
    });

    this.setupDefaultHandler();
    this.setupErrorHandlers(this.errorHandlers);

    this.layersInitialized = true;
  }

  protected setupMiddlewares(middlewares: RegistrableMiddleware[]): void {
    const routable = this.getRoutable();

    const middlewareMapper = (middlewares: Middleware[]): MiddlewareFunction[] =>
      middlewares.map((e) => {
        if (typeof e === 'function') {
          return e;
        } else {
          return (e as MiddlewareObject).handle.bind(e);
        }
      });

    middlewares.forEach((e: RegistrableMiddleware) => {
      const functions: MiddlewareFunction[] = middlewareMapper(e.middlewares);
      e.method !== undefined
        ? routable[e.method](e.path, ...functions)
        : routable.use(e.path, ...functions);
    });
  }

  /**
   * Deafult handler method is more important than registered functions
   */
  protected setupDefaultHandler(): void {
    console.log('setupDefaultHandler')
    if (this.defaultHandlerMethod) {
      // TODO :: Create method instead
      // @ts-ignore
      this.getRoutable().use(
        this.methodCreator(this.defaultHandlerMethod).bind(this)
      )
    } else if (this.defaultHandlerFunction) {
      this.getRoutable().use(this.defaultHandlerFunction.bind(this))
    }

    console.log('Finished');

    // Todo :: Bind item
    // this.getRoutable().use(this.defaultHandler.bind(this));
  }

  protected setupErrorHandlers(errorHandlers: ErrorHandlerEntry[]): void {
    const routable = this.getRoutable();

    Object.values(this.errorHandlerMethods).forEach(errorHandlermethod => {
      const method = this.errorHandlerCreator(errorHandlermethod).bind(this);
      routable.use(method);

    });

    this.errorHandlerFunctions.forEach(e => routable.use(e));
  }

  protected setupMethods(endpoints: ExpressEndpoint[]): void {
    const routable = this.getRoutable();

    endpoints.forEach((e: ExpressEndpoint) => {
      routable[e.methodType](
        e.path,
        ...e.middlewares.map((middleware: Middleware) =>
          typeof middleware === 'function' ? middleware : middleware.handle.bind(middleware),
        ), // VS  (req: any, res: any, next: any) => middleware.handle(req, res, next))),
        this.methodCreator(e).bind(this),
      );
    });
  }

  /**
   * Creates callable method for the endpoint
   * TODO :: Minimize overhead
   *
   * @param endpoint
   * @protected
   */
  protected methodCreator(endpoint: ExpressEndpoint): MiddlewareFunction {
    // This should be callable with this: { result, request, response, next }
    // TODO :: This should't be undefined right now!!
    console.log('Method Creator', endpoint)
    const wrapper = this.getResultWrapperFunction();

    return (request: ExpressRequest, response: ExpressResponse, next: NextFunction) => {
      const parameters: any[] = [];

      if (endpoint.parameters.length === 0) {
        parameters.push(request, response, next);
      } else {
        endpoint.parameters.sort((a, b) => (a.index! > b.index! ? 1 : -1));

        const addParameter = (value: any, index: number) => {
          endpoint.postProcessors[index]?.forEach((postProcessor) => {
            const rv = postProcessor(value);
            value = rv != undefined ? rv : value;
          });

          parameters.push(value);
        };

        endpoint.parameters.forEach((value, index) => {
          const { extractor, type } = ParameterExtractorStorage.get_parameter_extractor(value.name);

          if (type === 'Static') {
            addParameter(
              (extractor as StaticParameterExctractorFunction)(request, response, next),
              index,
            );
          } else if (type === 'Dynamic') {
            addParameter(
              (extractor as DynamicParameterExctractorFunction)(
                value.arguments,
                request,
                response,
                next,
              ),
              index,
            );
          }
        });
      }

      //@ts-ignore
      const result = this[endpoint.methodName].bind(this)(...parameters);
      // const result = endpoint.object_method.bind(this)(...parameters);

      if (wrapper && !response.headersSent) {
        // What happens if they call the next function
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

  protected errorHandlerCreator(endpoint: ErrorHandlerEntry): ErrorHandlerFunction {
    const callback = () => {};

    // Todo :: Post Processors
    return endpoint.parameters.length === 0
      //@ts-ignore
      ? (error: Error, request: ExpressRequest, response: ExpressResponse, next: NextFunction) => this[endpoint.methodName](error, request, response, next)
      : (error: Error, request: ExpressRequest, response: ExpressResponse, next: NextFunction) => {
          const parameters: any[] = [];
    
          endpoint.parameters.sort((a, b) => (a.index! > b.index! ? 1 : -1));
  
          const addParameter = (value: any, index: number) => {
            if (endpoint.postProcessors) {
              endpoint.postProcessors[index]?.forEach((postProcessor: any) => {
                const rv = postProcessor(value);
                value = rv != undefined ? rv : value;
              });
            }

            parameters.push(value);
          };
  
          endpoint.parameters.forEach((value, index) => {
            const { extractor, type } = ParameterExtractorStorage.get_parameter_extractor(value.name);
  
            if (type === 'Static') {
              addParameter(
                // TODO :: Add error handler @Error
                (extractor as StaticParameterExctractorFunction)(request, response, next),
                index,
              );
            } else if (type === 'Dynamic') {
              addParameter(
                (extractor as DynamicParameterExctractorFunction)(
                  value.arguments,
                  request,
                  response,
                  next,
                ),
                index,
              );
            }
          });


          //@ts-ignore
          this[endpoint.methodName](...parameters);
      }
  };

  /**
   * TODO :: Cucc
   * @protected
   */
  protected getResultWrapperFunction(): CallableFunction | undefined {
    // Todo ?? Debug this shit: `getResultWrapper`
    const wrapper: ResultWrapperType = this.getResultWrapper() as ResultWrapperType;

    console.log({wrapper})

    if (!wrapper) {return undefined;}
    if (typeof wrapper === 'function') {
      return wrapper as unknown as  MiddlewareFunction;
    }

    //@ts-ignore
    return this[wrapper.methodName].bind(this);
  }
}
