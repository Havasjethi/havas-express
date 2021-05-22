"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplexMiddleware = exports.MethodSpecificMiddlewares = exports.UseMiddleware = exports.PipeMiddleware = exports.MiddlewareObject = void 0;
var class_decorator_util_1 = require("./util/class_decorator_util");
var MiddlewareObject = /** @class */ (function () {
    function MiddlewareObject() {
    }
    return MiddlewareObject;
}());
exports.MiddlewareObject = MiddlewareObject;
var PipeMiddleware = /** @class */ (function (_super) {
    __extends(PipeMiddleware, _super);
    function PipeMiddleware() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PipeMiddleware.prototype.handle = function (req, res, next) {
        this.handle_method(req, res);
        next();
    };
    return PipeMiddleware;
}(MiddlewareObject));
exports.PipeMiddleware = PipeMiddleware;
// TODO :: Remove usage of `class_extender`
function UseMiddleware() {
    var middlewares = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        middlewares[_i] = arguments[_i];
    }
    var middleware_functions = middlewares.map(function (e) { return (typeof e === 'function') ? e : e.handle.bind(e); });
    return class_decorator_util_1.SetProperty(function (created_element) {
        created_element.add_constructor_middleware({ path: '/', middleware_functions: middleware_functions });
    });
}
exports.UseMiddleware = UseMiddleware;
function MethodSpecificMiddlewares(method) {
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    var middleware_functions = middlewares.map(function (e) { return (typeof e === 'function') ? e : e.handle.bind(e); });
    return class_decorator_util_1.SetProperty(function (created_element) {
        created_element.add_constructor_middleware({ method: method, path: '/', middleware_functions: middleware_functions });
    });
}
exports.MethodSpecificMiddlewares = MethodSpecificMiddlewares;
function ComplexMiddleware(_a) {
    var method = _a.method, path = _a.path;
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    var middleware_functions = middlewares.map(function (e) { return (typeof e === 'function') ? e : e.handle.bind(e); });
    return class_decorator_util_1.SetProperty(function (created_element) {
        created_element.add_constructor_middleware({ method: method, path: path, middleware_functions: middleware_functions });
    });
}
exports.ComplexMiddleware = ComplexMiddleware;
