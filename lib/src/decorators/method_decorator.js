"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = exports.Patch = exports.Head = exports.Option = exports.Put = exports.Delete = exports.Post = exports.Get = void 0;
// export function Get (path: string = '/', wrap: boolean, ...middlewares: Middleware[]) {
// export function Get (o: {path: string, wrap: boolean} , ...middlewares: Middleware[]) {
// export function Get (...args: [string, ...Middleware[]] | [string, boolean, ...Middleware[]] ) {
function Get(path) {
    if (path === void 0) { path = '/'; }
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        add_function(target, propertyKey, 'get', path, middlewares);
    };
}
exports.Get = Get;
function Post(path) {
    if (path === void 0) { path = '/'; }
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        add_function(target, propertyKey, 'post', path, middlewares);
    };
}
exports.Post = Post;
function Delete(path) {
    if (path === void 0) { path = '/'; }
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        add_function(target, propertyKey, 'delete', path, middlewares);
    };
}
exports.Delete = Delete;
function Put(path) {
    if (path === void 0) { path = '/'; }
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        add_function(target, propertyKey, 'put', path, middlewares);
    };
}
exports.Put = Put;
function Option(path) {
    if (path === void 0) { path = '/'; }
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        add_function(target, propertyKey, 'options', path, middlewares);
    };
}
exports.Option = Option;
function Head(path) {
    if (path === void 0) { path = '/'; }
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        add_function(target, propertyKey, 'head', path, middlewares);
    };
}
exports.Head = Head;
function Patch(path) {
    if (path === void 0) { path = '/'; }
    var middlewares = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        middlewares[_i - 1] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        add_function(target, propertyKey, 'patch', path, middlewares);
    };
}
exports.Patch = Patch;
function Method(method, path) {
    var middlewares = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        middlewares[_i - 2] = arguments[_i];
    }
    return function (target, propertyKey, descriptor) {
        add_function(target, propertyKey, method, path, middlewares);
    };
}
exports.Method = Method;
function add_function(target, method_name, method_type, path, middlewares) {
    target.add_method(method_name, method_type, path, middlewares);
}
