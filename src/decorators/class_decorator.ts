import { ErrorRequestHandler } from 'express';
import { ListenOptions } from 'net';
import { App, ErrorHandlerClass, ExpressCoreRoutable } from '../classes';
import { ResultWrapperFunction } from '../types';
import { Constructor, extender, SetProperty } from '../util';

export function Path<T extends ExpressCoreRoutable<any>>(path: string) {
  return SetProperty((object) => {
    object.setPath(path);
  });
}

export function ResultWrapper(result_wrapper_method: ResultWrapperFunction): any;
export function ResultWrapper(
  target: ExpressCoreRoutable<any>,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): void;

/*
 * Methods and classes could be annotated with this
 */
export function ResultWrapper(
  target: ResultWrapperFunction | ExpressCoreRoutable<any>,
  methodName?: string,
  propertyDescriptor?: PropertyDescriptor,
) {
  if (methodName === undefined && propertyDescriptor === undefined) {
    return SetProperty<ExpressCoreRoutable<any>>((element) => {
      element.registerResultWrapper(target as ResultWrapperFunction);
    });
  } else {
    extender.set_property<ExpressCoreRoutable>(target.constructor.name, (x) => {
      x.registerResultWrapperMethod(methodName!);
    });
  }
}

interface HostParams extends ListenOptions {
  auto_start?: boolean;
}

/**
 * Note: Auto Starting should be removed.
 */
export function Host(options: HostParams & { port?: number | string }) {
  options.auto_start = options.auto_start ?? false;
  options.port = typeof options.port! === 'string' ? parseInt(options.port, 10) : options.port;

  return (class_definition: Constructor<App>): Constructor<App> | any => {
    const constructor = extender.add_set_property(class_definition, (app) => {
      app.options = options;
    });

    if (options.auto_start) {
      extender.add_after_initialization(class_definition, (app) => {
        app.start_app();
      });
    }

    return constructor;
  };
}

export function ErrorHandler(errorHandler: ErrorRequestHandler | ErrorHandlerClass) {
  return SetProperty<ExpressCoreRoutable>((instance) =>
    instance.registerErrorHandlerFunction(errorHandler),
  );
}
