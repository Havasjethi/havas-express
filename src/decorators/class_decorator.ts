import {Routable} from "../classes/routable";
import {class_extender} from "./util";
import {App} from "../app";

/**
 * TODO :: Rewrite with `class_extender` Problem: App.auto_start
 * @param path
 */
export function Path(path: string) {
  return class_extender<Routable<any>>(object => object.set_path(path));
}

export function ResultWrapper(result_wrapper_method: Routable<any>["result_wrapper"]) {
  return class_extender<Routable<any>>(element => {
    element.set_result_wrapper(result_wrapper_method);
  });
}

interface HostParams {
  port_number: number | string;
  host?: string;
  auto_start?: boolean;
}

export function Host({
                       port_number = -1,
                       host = 'localhost',
                       auto_start = true
                     }: HostParams) {

  return class_extender<App>((app) => {
    app.port = typeof(port_number) === 'string' ? parseInt(port_number, 10) : port_number;
    app.host = host;
    // app.auto_start = auto_start;
  });
}
