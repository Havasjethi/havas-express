import { ErrorRequestHandler } from 'express';
import { ListenOptions } from 'net';
import { App } from '../classes/app';
import { ControllerTree } from '../di/controller_tree';
import { ErrorHandlerClass } from '../classes/error_handler';
import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { ResultWrapperFunction } from '../classes/types/result_wrapper';
import { Constructor, extender, SetProperty, AfterCreate } from '../util/class_decorator_util';

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
 * TODO :: Implement this
 * Methods and classes could be annotated with this
 * @returns asd
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
    console.log('Me called Before');

    extender.set_property<ExpressCoreRoutable>(target.constructor.name, (x) => {
      x.registerResultWrapperMethod(methodName!);
    });
  }
}

interface HostParams extends ListenOptions {
  auto_start?: boolean;
}

export function Host(options: HostParams & { port?: number | string }) {
  options.auto_start = options.auto_start ?? false;
  options.port = typeof options.port === 'string' ? parseInt(options.port, 10) : options.port;

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
