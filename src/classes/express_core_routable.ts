import { ErrorRequestHandler, IRouter } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { BaseCoreRouter } from 'havas-core';
import { ExpressRequest, ExpressResponse, Next, ParameterExtractorStorage } from '../../index';
import { MethodEntry } from '../interfaces/method_entry';
import { ErrorHandlerClass } from './error_handler';
import { MiddlewareObject } from './middleware';
import { ExpressEndpoint } from './types/endpoint';
import { ErrorHandlerEntry, ErrorHandlerShort, ErrorHandlerType } from './types/error';
import { Middleware, MiddlewareFunction, RegistrableMiddleware } from './types/middleware';
import { ResultWrapperType } from './types/result_wrapper';


export abstract class ExpressCoreRoutable<T extends IRouter = IRouter>
  extends BaseCoreRouter<ExpressEndpoint, RegistrableMiddleware, ErrorHandlerEntry, ResultWrapperType> {


  public abstract routable: T;
  public layersInitialized: boolean = false;

  public children: ExpressCoreRoutable[] = [];

  compose () {

  }

  getRoutable (): IRouter {
    return this.routable;
  }

  /**
   * Add endpoints
   */
  public setupLayers (): void {
    this.setupMiddlewares(this.middlewares);
    this.setupMethods(this.endpoints);

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

  protected setupMiddlewares (middlewares: RegistrableMiddleware[]): void {
    const routable = this.getRoutable();

    const middlewareMapper = (middlewares: Middleware[]): MiddlewareFunction[] =>
      middlewares.map(e => {
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

  protected setupDefaultHandler (): void {
    if (!this.defaultHandler) {
      return;
    }

    // Todo :: Bind item
    // this.getRoutable().use(this.defaultHandler.bind(this));
  }

  protected setupErrorHandlers (errorHandlers: ErrorHandlerEntry[]): void {
    const routable = this.getRoutable();

    errorHandlers.forEach(({ handler, type }) => {
      if (type === ErrorHandlerType.ErrorHandlerShort) {
        routable.use((error: Error, request: ExpressRequest, response: ExpressResponse, next: NextFunction) =>
          (handler as ErrorHandlerShort)({ error, request, response, next }));
      } else if (type === ErrorHandlerType.ErrorHandlerClass) {
        routable.use((error: Error, request: ExpressRequest, response: ExpressResponse, next: NextFunction) =>
          (handler as ErrorHandlerClass).handle({ error, request, response, next }));
      } else if (type === ErrorHandlerType.ErrorRequestHandler) {
        routable.use((handler as ErrorRequestHandler));
      }
    });
  }

  protected setupMethods (endpoints: ExpressEndpoint[]): void {
    const routable = this.getRoutable();

    endpoints.forEach((e: ExpressEndpoint) => {
      routable[e.methodType](
        e.path,
        ...(e.middlewares.map((middleware: Middleware) => typeof middleware === 'function'
          ? middleware
          : middleware.handle.bind(middleware))), // VS  (req: any, res: any, next: any) => middleware.handle(req, res, next))),
        this.methodCreator(e));
    });
  }

  /**
   * Creates callable method for the endpoint
   * TODO :: Minimize overhead
   *
   * @param endpoint
   * @protected
   */
  protected methodCreator (endpoint: ExpressEndpoint): any {
    const wrapper = this.getResultWrapper();

    return (request: ExpressRequest, response: ExpressResponse, next: NextFunction) => {
      const parameters: any[] = [];

      if (endpoint.parameters.length === 0) {
        parameters.push(request, response, next);
      } else {
        endpoint.parameters.sort((a, b) => a.index! > b.index! ? 1 : -1);

        const addParameter = (value: any, index: number) => {
          endpoint.postProcessors[index]?.forEach(postProcessor => {
            const rv = postProcessor(value);
            value = rv != undefined
              ? rv
              : value;
          });

          parameters.push(value);
        };

        endpoint.parameters.forEach((value, index) => {
          const extractor = ParameterExtractorStorage.get_parameter_extractor(value.name);
          addParameter(
            extractor(
              value.arguments,
              request,
              response,
              next),
            index,
          );
        });
      }

      //@ts-ignore
      const result = this[endpoint.methodName].bind(this)(...parameters)
      // const result = endpoint.object_method.bind(this)(...parameters);


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
