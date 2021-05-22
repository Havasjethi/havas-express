import { Routable } from "../classes/routable";
import { Constructor } from "../util/class_decorator_util";
import { App } from "../app";
export declare function Path<T extends Routable<any>>(path: string): import("../util/class_decorator_util").LifeCycleClassDecorator<any>;
export declare function ResultWrapper(result_wrapper_method: Routable<any>["result_wrapper"]): import("../util/class_decorator_util").LifeCycleClassDecorator<Routable<any>>;
interface HostParams {
    port_number: number | string;
    host?: string;
    auto_start?: boolean;
}
export declare function Host({ port_number, host, auto_start, }: HostParams): (class_definition: Constructor<App>) => Constructor<App> | any;
export {};
