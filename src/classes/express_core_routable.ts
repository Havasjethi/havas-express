import { IRouter } from 'express';
import { NextFunction } from 'express-serve-static-core';
import {
  BaseCoreRouter,
  DecoratedParameters,
  Objectified,
  PostProcessor,
  RegistrableMethod,
} from 'havas-core';
import {
  DynamicParameterExctractorFunction,
  ExpressRequest,
  ExpressResponse,
  ParameterExtractorStorage,
  StaticParameterExctractorFunction,
} from '../../index';
import { ExpressHttpMethod } from '../types/native_http_methods';
import { ErrorHandlerClass, ErrorHandlerFunction } from './error_handler';
import { MiddlewareObject } from './middleware';
import { ExpressEndpoint } from './types/endpoint';
import { ErrorHandlerEntry, RegistreableErrorHandler } from './types/error';
import { ExpressFunction, Middleware, RegistrableMiddleware } from './types/middleware';
import { ResultWrapperType } from './types/result_wrapper';

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

  parameterExtractors: { [name: string]: DecoratedParameters[] } = {};

  public addParameterExtractor(
    methodName: string,
    parameterIndex: number,
    extractorName: string,
    argument?: any[],
  ) {
    const extractor = (this.parameterExtractors[methodName] ??= []);

    extractor.push({
      name: extractorName,
      index: parameterIndex,
      arguments: argument,
    });
  }

  parameterPostProcessors: { [name: string]: { [index: number]: PostProcessor[] } } = {};

  public addRequestPostprocessor<T extends PostProcessor = PostProcessor>(
    methodName: string,
    index: number,
    post_processor: T,
  ) {
    const postProcessor = ((this.parameterPostProcessors[methodName] ??= {})[index] ??= []);

    postProcessor.push(post_processor);
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
    endpoint.postProcessors = this.parameterPostProcessors[methodName];
  }

  public add_constructor_middleware(middleware: RegistrableMiddleware) {
    this.middlewares.push(middleware);
  }

  public registerResultWrapperMethod(resultWrapperName: string) {
    this.registerResultWrapper({
      methodName: resultWrapperName,
      parameters: this.parameterExtractors[resultWrapperName],
      postProcessors: {},
    } as RegistrableMethod);
  }

  errorHandlerFunctions: ErrorHandlerFunction[] = [];
  errorHandlerMethods: Objectified<RegistrableMethod> = {};

  public registerErrorHandlerFunction(
    errorHandler: ErrorHandlerFunction | ErrorHandlerClass,
  ): void {
    if (typeof errorHandler === 'object') {
      this.errorHandlerFunctions.push((error, request, response, next) =>
        (errorHandler as ErrorHandlerClass).handle({ error, request, response, next }),
      );
    } else if (typeof errorHandler === 'function') {
      this.errorHandlerFunctions.push(errorHandler);
    } else {
      console.error('Unable to register function: ', typeof errorHandler);
      throw new Error('Unable to register function');
    }
  }

  public registerErrorHandler(methodName: string) {
    this.errorHandlerMethods[methodName] = {
      methodName,
      parameters: this.parameterExtractors[methodName],
    };
  }

  defaultHandlerMethod?: ExpressEndpoint;
  defaultHandlerFunction?: ExpressFunction;

  public registerDefaultHandlerFunction(defaultHandler: ExpressFunction) {
    this.defaultHandlerFunction = defaultHandler;
  }

  public registerDefaultHandlerMethod(handlerName: string) {
    this.defaultHandlerMethod = {
      methodName: handlerName,
      name: handlerName,
      parameters: this.parameterExtractors[handlerName] ?? [],
      methodType: 'all',
      path: '*',
      middlewares: [],
      postProcessors: [],
    };
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

    const middlewareMapper = (middlewares: Middleware[]): ExpressFunction[] =>
      middlewares.map((e) => {
        if (typeof e === 'function') {
          return e;
        } else {
          return (e as MiddlewareObject).handle.bind(e);
        }
      });

    middlewares.forEach((e: RegistrableMiddleware) => {
      const functions: ExpressFunction[] = middlewareMapper(e.middlewares);
      e.method !== undefined
        ? routable[e.method](e.path, ...functions)
        : routable.use(e.path, ...functions);
    });
  }

  /**
   * Deafult handler method is more important than registered functions
   */
  protected setupDefaultHandler(): void {
    if (this.defaultHandlerMethod) {
      // TODO :: Create method instead
      // @ts-ignore
      this.getRoutable().use(this.methodCreator(this.defaultHandlerMethod).bind(this));
    } else if (this.defaultHandlerFunction) {
      this.getRoutable().use(this.defaultHandlerFunction.bind(this));
    }

    // Todo :: Bind item
    // this.getRoutable().use(this.defaultHandler.bind(this));
  }

  protected setupErrorHandlers(errorHandlers: ErrorHandlerEntry[]): void {
    const routable = this.getRoutable();

    Object.values(this.errorHandlerMethods).forEach((errorHandlermethod) => {
      const method = this.errorHandlerCreator(errorHandlermethod).bind(this);
      routable.use(method);
    });

    this.errorHandlerFunctions.forEach((e) => routable.use(e));
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
   * Wrap function if wrapper defined
   * @private
   */
  private mightWrapFunction(functionToWrap: ExpressFunction): ExpressFunction {
    const wrapper = this.getResultWrapperFunction();

    return wrapper === undefined
      ? functionToWrap
      : (request: ExpressRequest, response: ExpressResponse, next: NextFunction) => {
          const result = functionToWrap(request, response, next);

          if (!response.headersSent) {
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

  /**
   * Creates callable method for the endpoint
   * TODO :: Minimize overhead
   *
   * @param endpoint
   * @protected
   */
  protected methodCreator(endpoint: ExpressEndpoint): ExpressFunction {
    const methodFuntion: ExpressFunction =
      endpoint.parameters === undefined || endpoint.parameters.length === 0
        ? //@ts-ignore
          this[endpoint.methodName]
        : (request, response, next): ExpressFunction => {
            const parameters = this.getParameters(endpoint, request, response, next);

            //@ts-ignore
            return this[endpoint.methodName].bind(this)(...parameters);
          };

    return this.mightWrapFunction(methodFuntion);
  }

  protected getParameters(
    endpoint: ExpressEndpoint,
    request: ExpressRequest,
    response: ExpressResponse,
    next: NextFunction,
  ) {
    const parameters: any[] = [];

    endpoint.parameters.sort((a, b) => (a.index! > b.index! ? 1 : -1));

    const addParameter = (value: any, index: number) => {
      parameters.push(
        endpoint.postProcessors && (endpoint.postProcessors[index] || []).length > 0
          ? endpoint.postProcessors[index].reduce(
              (v, postProcessor) => postProcessor(v) ?? v,
              value,
            )
          : value,
      );
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

    return parameters;
  }

  protected errorHandlerCreator(endpoint: ErrorHandlerEntry): ErrorHandlerFunction {
    const callback = () => {};

    // Todo :: Post Processors
    return endpoint.parameters.length === 0
      ? (error: Error, request: ExpressRequest, response: ExpressResponse, next: NextFunction) =>
          //@ts-ignore
          this[endpoint.methodName](error, request, response, next)
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
            const { extractor, type } = ParameterExtractorStorage.get_parameter_extractor(
              value.name,
            );

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
        };
  }

  /**
   * @protected
   */
  protected getResultWrapperFunction(): CallableFunction | undefined {
    // Todo ?? Debug this if actual: `getResultWrapper`
    const wrapper: ResultWrapperType = this.getResultWrapper() as ResultWrapperType;

    if (!wrapper) {
      return undefined;
    }
    if (typeof wrapper === 'function') {
      return wrapper as unknown as ExpressFunction;
    }

    //@ts-ignore
    return this[wrapper.methodName].bind(this);
  }
}
