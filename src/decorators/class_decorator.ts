import { Routable } from "../classes/routable";
import { Constructor, extender, SetProperty } from "../util/class_decorator_util";
import { App } from "../classes/app";
import { ErrorRequestHandler } from "express";
import { ErrorHandlerClass } from "../classes/error_handler";
import { ListenOptions } from "net";

export function Path<T extends Routable<any>>(path: string) {
  return SetProperty(object => object.set_path(path));
}

export function ResultWrapper(result_wrapper_method: Routable<any>["result_wrapper"]) {
  return SetProperty<Routable<any>>(element => {
    element.set_result_wrapper(result_wrapper_method);
  });
}

interface HostParams extends ListenOptions {
  auto_start?: boolean;
}


export function Host(options: (HostParams & { port?: number | string })) {
  options.auto_start = options.auto_start ?? false;
  options.port = typeof (options.port) === 'string' ? parseInt(options.port, 10) : options.port;

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
  }
}

export function ErrorHandler(error_handler: ErrorRequestHandler | ErrorHandlerClass) {
  return SetProperty<Routable>((instance) => instance.add_error_handler(error_handler));
}
