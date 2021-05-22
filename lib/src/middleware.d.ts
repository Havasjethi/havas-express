import { ExpressRequest, ExpressResponse } from "../index";
import { Middleware, MiddlewareEntry } from "./interfaces/method_entry";
import { ExpressRoutable, Routable } from "./classes/routable";
import { ExpressHttpMethod } from "./types/native_http_methods";
export declare abstract class MiddlewareObject {
    abstract handle(req: ExpressRequest, res: ExpressResponse, next: Function): void;
}
export declare abstract class PipeMiddleware extends MiddlewareObject {
    handle(req: ExpressRequest, res: ExpressResponse, next: Function): void;
    /**
     * If the returned value is `false` the next handler won't be called
     * @param req
     * @param res
     */
    abstract handle_method(req: ExpressRequest, res: ExpressResponse): void;
}
export declare function UseMiddleware<R extends ExpressRoutable>(...middlewares: Middleware[]): import("./util/class_decorator_util").LifeCycleClassDecorator<Routable<R>>;
export declare function MethodSpecificMiddlewares<R extends ExpressRoutable>(method: ExpressHttpMethod, ...middlewares: Middleware[]): import("./util/class_decorator_util").LifeCycleClassDecorator<Routable<R>>;
export declare function ComplexMiddleware<R extends ExpressRoutable>({ method, path }: MiddlewareEntry, ...middlewares: Middleware[]): import("./util/class_decorator_util").LifeCycleClassDecorator<Routable<R>>;
