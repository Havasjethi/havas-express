import { ErrorRequestHandler, IRouter } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { BaseCoreRouter, Objectified, RegistrableMethod } from 'havas-core';
import { interfaces } from 'inversify';
import {
  ExpressRequest,
  ExpressResponse,
  mainContainer,
  ParameterExtractorStorage,
  ResultWrapperFunction,
} from '../../index';
import {
  DynamicParameterExtractorFunction,
  ExpressHttpMethod,
  isProcessorFactory,
  StaticParameterExtractorFunction,
  UniversalPostProcessor,
} from '../types';
import {
  ErrorHandlerEntry,
  ExpressEndpoint,
  RegistrableErrorHandler,
  ResultWrapperType,
} from '../types/classes';
import {
  ExpressFunction,
  Middleware,
  MiddleWareFunction,
  RegistrableMiddleware,
} from '../types/classes/middleware';
import { ErrorHandlerClass, ErrorHandlerFunction } from './error_handler';
import { MiddlewareObject } from './middleware';
import { postProcessorStorage } from './post_processor_storage';
import ServiceIdentifier = interfaces.ServiceIdentifier;

const isPromise = (value: any) => value?.constructor?.name === 'Promise';

export abstract class ExpressCoreRoutable<T extends IRouter = IRouter> extends BaseCoreRouter<
  ExpressEndpoint,
  RegistrableMiddleware,
  ErrorHandlerEntry,
  ResultWrapperType
> {
  public routable: T;
  public layersInitialized: boolean = false;

  public errorHandlersMethods: { [name: string]: RegistrableErrorHandler } = {};

  public children: ExpressCoreRoutable[] = [];

  protected parameterExtractors: { [endpoint_name: string]: ExpressEndpoint['parameters'] } = {};

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

  private getEndpoint(name: string): ExpressEndpoint {
    if (this.endpoints[name] === undefined) {
      this.endpoints[name] = {
        postProcessors: [],
        methodName: name,
        middlewares: [],
        parameters: [],
      } as unknown as ExpressEndpoint;
    }

    return this.endpoints[name];
  }

  public addParameterExtractor(
    methodName: string,
    parameterIndex: number,
    extractorName: string,
    argument?: any[],
    postProcessors?: (((processable: any) => any) | { token: string; args?: any[] })[],
    // postProcessors?: PostProcessorType[],
  ) {
    const extractor = (this.parameterExtractors[methodName] ??= []);

    extractor.push({
      name: extractorName,
      index: parameterIndex,
      arguments: argument,
      postProcessors: postProcessors,
      // : undefined,
      // postProcessors: postProcessors ?? [],
    });
  }

  /**
   * Register request handler methods -- @Get, @Post...
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
    this.registerResultWrapper({
      methodName: resultWrapperName,
      parameters: this.parameterExtractors[resultWrapperName],
      // postProcessors: {},
    } as RegistrableMethod<UniversalPostProcessor>);
  }

  errorHandlerFunctions: ErrorHandlerFunction[] = [];
  errorHandlerMethods: Objectified<RegistrableMethod<UniversalPostProcessor>> = {};

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
      console.error(`Unable to register function with given type: ${typeof errorHandler}`);
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
      parameters: this.parameterExtractors[handlerName] ?? [],
      methodType: 'all',
      path: '*',
      middlewares: [],
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

    // TODO ::
    //  Add this pls: Initialize Result Wrapper Function for each nodes (Router)
    //  this.setupDefaultHandler(this.get_added_methods() as Required<MethodEntry>[]);

    this.children.forEach((child: ExpressCoreRoutable) => {
      if (!child.layersInitialized) {
        child.setupLayers();
      }

      this.getRoutable().use(child.path, child.getRoutable());
    });

    this.setupDefaultHandler();
    this.setupErrorHandlers();

    this.layersInitialized = true;
  }

  protected setupMiddlewares(middlewares: RegistrableMiddleware[]): void {
    const routable = this.getRoutable();

    for (const middlewareEntry of middlewares) {
      const functions: MiddleWareFunction[] = middlewareEntry.middlewares.map((e) =>
        this._middleWareHandlerConverter(e),
      );

      // Adding Converted middleware Function to Express
      middlewareEntry.method !== undefined
        ? routable[middlewareEntry.method](middlewareEntry.path, ...functions)
        : routable.use(middlewareEntry.path, ...functions);
    }
  }

  protected _middleWareHandlerConverter(middleware: Middleware): MiddleWareFunction {
    const middlewareHandler =
      // @ts-ignore
      middleware?.prototype?.getHandler ||
      // @ts-ignore
      middleware?.prototype?.prototype?.getHandler ||
      // @ts-ignore
      middleware?.prototype?.prototype?.prototype?.getHandler ||
      // @ts-ignore
      middleware?.prototype?.prototype?.prototype?.prototype?.getHandler;
    const isMiddlewareClass = !!middlewareHandler;

    if (isMiddlewareClass) {
      const obj = mainContainer.get(middleware as ServiceIdentifier<MiddlewareObject>);
      return obj.getHandler.bind(obj);
    }

    if (typeof middleware === 'function') {
      return middleware as MiddleWareFunction;
    }

    if (typeof middleware === 'object' && !!middleware.getHandler) {
      return (middleware as MiddlewareObject).getHandler.bind(middleware);
    }

    console.error('Error :: Middleware called with invalid value', middlewareHandler);
    // @ts-ignore
    return (req, res, next) => {
      next();
    };
  }

  /**
   * Default handler method is more important than registered functions
   */
  protected setupDefaultHandler(): void {
    if (this.defaultHandlerMethod) {
      // TODO :: Create method instead // Note :: This comment might be outdated
      this.getRoutable().use(this.methodCreator(this.defaultHandlerMethod).bind(this));
    } else if (this.defaultHandlerFunction) {
      this.getRoutable().use(this.defaultHandlerFunction.bind(this));
    }
  }

  protected setupErrorHandlers(): void {
    const routable = this.getRoutable();

    Object.values(this.errorHandlerMethods).forEach((errorHandlerMethod) => {
      const method = this.errorHandlerCreator(errorHandlerMethod).bind(this);
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
          this._middleWareHandlerConverter(middleware),
        ),
        this.methodCreator(e).bind(this),
      );
    });
  }

  /**
   * Creates callable method for the endpoint
   * TODO :: Minimize overhead // Note: Performance tests are prerequisite
   *
   * @param endpoint
   * @protected
   */
  protected methodCreator(endpoint: ExpressEndpoint): ExpressFunction {
    const methodFunction: ExpressFunction =
      endpoint.parameters === undefined || endpoint.parameters.length === 0
        ? //@ts-ignore
          this[endpoint.methodName] // TODO :: ??Bind this??
        : async (request, response, next): Promise<ExpressFunction> => {
            const parameters = await this.get_endpoint_parameters(
              endpoint,
              request,
              response,
              next,
            );

            //@ts-ignore
            return (this[endpoint.methodName] as CallableFunction).apply(this, parameters);
          };

    return this.mightWrapFunction(methodFunction);
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

          if (response.headersSent) {
            return;
          }
          // What happens if they call the next function
          if (isPromise(result)) {
            result
              .then((result: any) => {
                // TODO :: check `response.headersSent` again
                (wrapper as ResultWrapperFunction)({ result, request, response, next });
              })
              .catch((e: any) => next(e));
          } else {
            (wrapper as ResultWrapperFunction)({ result, request, response, next });
          }
        };
  }

  protected async get_endpoint_parameters(
    endpoint: ExpressEndpoint,
    request: ExpressRequest,
    response: ExpressResponse,
    next: NextFunction,
  ): Promise<any[]> {
    const parameters: any[] = [];

    for (const parameter of endpoint.parameters.sort((a, b) => a.index! - b.index!)) {
      const { extractor, type } = ParameterExtractorStorage.get_parameter_extractor(parameter.name);
      let preprocessed_value;

      if (type === 'Static') {
        preprocessed_value = (extractor as StaticParameterExtractorFunction)(
          request,
          response,
          next,
        );
      } else if (type === 'Dynamic') {
        preprocessed_value = (extractor as DynamicParameterExtractorFunction)(
          parameter.arguments,
          request,
          response,
          next,
        );
      }

      const final_value = parameter.postProcessors
        ? await this.post_process_parameter(parameter.postProcessors, preprocessed_value)
        : preprocessed_value;

      parameters.push(final_value);
    }

    return parameters;
  }

  protected async post_process_parameter<Result = any>(
    post_processors: UniversalPostProcessor[],
    processable: any,
  ): Promise<Result> {
    let processed_value = processable;

    for (const processor of post_processors) {
      let intermediate_value;

      if (typeof processor === 'function') {
        intermediate_value = processor(processable);
      } else if (isProcessorFactory(processor)) {
        const processorFunction = postProcessorStorage.getPostProcessorFactoryDangerous(
          processor.token,
        );
        intermediate_value = processorFunction(processable, processor.args);
      } else {
        const processorFunction = postProcessorStorage.getPostProcessorDangerous(processor.token);
        intermediate_value = processorFunction(processable);
      }

      processed_value = isPromise(intermediate_value)
        ? await intermediate_value
        : intermediate_value;
    }

    return processed_value;
  }

  protected errorHandlerCreator(endpoint: ErrorHandlerEntry): ErrorHandlerFunction {
    // Todo :: Post Processors // Will be implemented in the PostProcessor update
    return !endpoint.parameters || endpoint.parameters.length === 0
      ? (error, request, response, next): ErrorRequestHandler =>
          //@ts-ignore
          this[endpoint.methodName](error, request, response, next)
      : async (error, request, response, next): Promise<ErrorRequestHandler> => {
          const parameters = await this.get_error_handler_parameters(
            endpoint,
            error,
            request,
            response,
            next,
          );

          // @ts-ignore
          return (this[endpoint.methodName] as CallableFunction).apply(this, parameters);
        };
  }

  protected async get_error_handler_parameters(
    endpoint: ErrorHandlerEntry,
    error: Error,
    request: ExpressRequest,
    response: ExpressResponse,
    next: NextFunction,
  ): Promise<any[]> {
    const parameters: any[] = [];

    for (const parameter of endpoint.parameters.sort((a, b) => a.index! - b.index!)) {
      const { extractor, type } = ParameterExtractorStorage.get_parameter_extractor(parameter.name);
      let preprocessed_value;

      if (type === 'Static') {
        preprocessed_value = (extractor as StaticParameterExtractorFunction)(
          request,
          response,
          next,
          error,
        );
      } else if (type === 'Dynamic') {
        preprocessed_value = (extractor as DynamicParameterExtractorFunction)(
          parameter.arguments,
          request,
          response,
          next,
        );
      }

      const final_value = parameter.postProcessors
        ? await this.post_process_parameter(parameter.postProcessors, preprocessed_value)
        : preprocessed_value;

      parameters.push(final_value);
    }

    return parameters;
  }

  /**
   * @protected
   */
  protected getResultWrapperFunction(): ExpressFunction | ResultWrapperFunction<any> | undefined {
    const wrapperWithClass = this.getResultWrapper();

    if (!wrapperWithClass) {
      return undefined;
    }

    const [wrapper, wrapperClass] = wrapperWithClass;

    if (typeof wrapper === 'function') {
      return wrapper as unknown as ExpressFunction;
    }

    return !wrapper.parameters || wrapper.parameters.length === 0
      ? //@ts-ignore
        this[wrapper.methodName].bind(this)
      : ((({ result, request, response, next }) => {
          // TODO :: Update decorated parameters!!
          const parameters = (wrapper as ExpressEndpoint).parameters
            .sort((a, b) => a.index! - b.index!)
            .map((e) => {
              const { extractor, type } = ParameterExtractorStorage.get_parameter_extractor(e.name);

              switch (type) {
                case 'Static':
                  return (extractor as StaticParameterExtractorFunction)(
                    request,
                    response,
                    next,
                    undefined,
                    result,
                  );
                case 'Dynamic':
                  return (extractor as DynamicParameterExtractorFunction)(
                    e.arguments,
                    request,
                    response,
                    next,
                    undefined,
                  );
              }
            });

          // @ts-ignore
          wrapperClass[wrapper.methodName].bind(wrapperClass)(...parameters);
        }) as ResultWrapperFunction<any>);
  }
}
