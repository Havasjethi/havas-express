import { ErrorRequestHandler } from "express";
import { ListenOptions } from "net";
import { App } from "../classes/app";
import { ErrorHandlerClass } from "../classes/error_handler";
import { ExpressCoreRoutable } from "../classes/express_core_routable";
import { Constructor, extender, SetProperty } from "../util/class_decorator_util";

export function Path<T extends Routable<any>> (path: string) {
  return SetProperty(object => object.set_path(path));
}

export function ResultWrapper (result_wrapper_method: Routable<any>["result_wrapper"]): any;
export function ResultWrapper (target: Routable<any>, propertyKey: string, descriptor: PropertyDescriptor): void;

/*
 * TODO :: Implement this
 * Methods and classes could be annotated with this
 * @returns asd
 */
export function ResultWrapper (
  target: Routable<any>["result_wrapper"] | Routable<any>,
  method_name?: string,
  parameter_index?: PropertyDescriptor) {

  if (method_name === undefined && parameter_index === undefined) {
    return SetProperty<Routable<any>>(element => {
      element.set_result_wrapper(target as Routable<any>["result_wrapper"]);
    });
  } else {
    // TODO :: Add method call to bullshit

    return (target: Routable, method_name: string, parameter_index: number) => {
      extender.set_property<Routable>(target.constructor.name, (x) => {
        x.set_result_wrapper_method_name(method_name);
      });
    };
  }

}


interface HostParams extends ListenOptions {
  auto_start?: boolean;
}


export function Host (options: (HostParams & { port?: number | string })) {
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
  };
}

export function ErrorHandler (error_handler: ErrorRequestHandler | ErrorHandlerClass) {
  return SetProperty<Routable>((instance) => instance.add_error_handler(error_handler));
}
