import { MethodEntry, MethodParameterData, MethodParameterEntry, MethodParameterType, Middleware, MiddlewareFunction } from "../interfaces/method_entry";
import { ExpressHttpMethod } from "../types/native_http_methods";
import { ExpressRequest, ExpressResponse } from "../../index";
import { IRouter } from "express";
export declare type ExpressRoutable = IRouter;
interface RegistrableMiddleware {
    path: string;
    method?: ExpressHttpMethod;
    middleware_functions: MiddlewareFunction[];
}
export interface ResultWrapperParameters {
    result: any;
    request: ExpressRequest;
    response: ExpressResponse;
    next: Function;
}
export declare abstract class Routable<T extends ExpressRoutable> {
    routable_object: T;
    path: string;
    children_routable: Routable<any>[];
    parent: Routable<any> | null;
    protected layers_initialized: boolean;
    protected middlewares: RegistrableMiddleware[];
    protected result_wrapper: ((o: ResultWrapperParameters) => any) | null;
    protected methods: {
        [method_name: string]: MethodEntry;
    };
    protected method_parameters: {
        [method_name: string]: MethodParameterEntry<any>[];
    };
    protected constructor(routable_object: T);
    abstract remove_layers(): void;
    protected initialize(): void;
    set_result_wrapper(wrapper_function: Routable<any>['result_wrapper']): void;
    get_result_wrapper(): Routable<any>['result_wrapper'];
    add_method(method_name: string, http_method: ExpressHttpMethod, path?: string, middlewares?: Middleware[]): this;
    add_method_parameter<T extends MethodParameterType>(method_name: string, parameter_type: T, index: number, extra_data?: MethodParameterData | undefined): void;
    get_routable(): T;
    get_initialized_routable(): T;
    add_constructor_middleware(middleware: RegistrableMiddleware): void;
    get_path(): string;
    append<T extends ExpressRoutable>(other: Routable<T>): this;
    append_to<T extends ExpressRoutable>(container: Routable<T>): this;
    set_path(path: string): this;
    get_added_methods(): MethodEntry[];
    /**
     * Add endpoints
     */
    setup_layers(): void;
    protected setup_middlewares(middlewares: RegistrableMiddleware[]): void;
    protected setup_methods(added_methods: MethodEntry[]): void;
    /**
     * Creates callable method for the endpoint
     * TODO :: Minimize overhead
     * @param e
     * @protected
     */
    protected method_creator(e: MethodEntry): any;
}
export {};
