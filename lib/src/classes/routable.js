"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routable = void 0;
var Routable = /** @class */ (function () {
    function Routable(routable_object) {
        this.path = '/';
        this.children_routable = [];
        this.parent = null;
        this.layers_initialized = false;
        this.middlewares = [];
        this.result_wrapper = null;
        this.routable_object = routable_object;
        //@ts-ignore
        if (!this.methods) {
            this.methods = {};
        }
        //@ts-ignore
        if (!this.method_parameters) {
            this.method_parameters = {};
        }
    }
    Routable.prototype.initialize = function () {
        if (!this.methods) {
            this.methods = {};
        }
        if (!this.method_parameters) {
            this.method_parameters = {};
        }
    };
    Routable.prototype.set_result_wrapper = function (wrapper_function) {
        this.result_wrapper = wrapper_function;
    };
    Routable.prototype.get_result_wrapper = function () {
        var _a, _b, _c;
        return (_c = (_a = this.result_wrapper) !== null && _a !== void 0 ? _a : (_b = this.parent) === null || _b === void 0 ? void 0 : _b.get_result_wrapper()) !== null && _c !== void 0 ? _c : null;
    };
    Routable.prototype.add_method = function (method_name, http_method, path, middlewares) {
        var _a;
        if (path === void 0) { path = '/'; }
        if (middlewares === void 0) { middlewares = []; }
        this.initialize();
        var method_entry = {
            object_method: method_name,
            http_method: http_method,
            path: path,
            middlewares: middlewares,
            method_parameters: (_a = this.method_parameters[method_name]) !== null && _a !== void 0 ? _a : [],
            use_wrapper: true,
        };
        if (this.methods[method_name]) {
            throw new Error('Method is already added, Modify instead recreation.');
        }
        this.methods[method_name] = method_entry;
        return this;
    };
    Routable.prototype.add_method_parameter = function (method_name, parameter_type, index, extra_data) {
        if (extra_data === void 0) { extra_data = undefined; }
        this.initialize();
        if (!this.method_parameters[method_name]) {
            this.method_parameters[method_name] = [];
        }
        this.method_parameters[method_name].push({
            parameter_index: index,
            parameter_type: parameter_type,
            extra_data: extra_data
        });
    };
    Routable.prototype.get_routable = function () {
        return this.routable_object;
    };
    ;
    Routable.prototype.get_initialized_routable = function () {
        if (!this.layers_initialized) {
            this.setup_layers();
        }
        return this.routable_object;
    };
    Routable.prototype.add_constructor_middleware = function (middleware) {
        this.middlewares.push(middleware);
    };
    Routable.prototype.get_path = function () {
        return this.path;
    };
    Routable.prototype.append = function (other) {
        this.children_routable.push(other);
        other.parent = this;
        return this;
    };
    Routable.prototype.append_to = function (container) {
        container.append(this);
        return this;
    };
    Routable.prototype.set_path = function (path) {
        this.path = path;
        return this;
    };
    Routable.prototype.get_added_methods = function () {
        return Object.values(this.methods);
    };
    /**
     * Add endpoints
     */
    Routable.prototype.setup_layers = function () {
        var _this = this;
        this.setup_middlewares(this.middlewares);
        this.setup_methods(this.get_added_methods());
        this.children_routable.forEach(function (child) {
            if (!child.layers_initialized) {
                child.setup_layers();
            }
            _this.get_routable().use(child.get_path(), child.get_routable());
        });
        this.layers_initialized = true;
    };
    Routable.prototype.setup_middlewares = function (middlewares) {
        var routable = this.get_routable();
        console.log(middlewares);
        middlewares.forEach(function (e) { return e.method !== undefined
            ? routable[e.method].apply(routable, __spreadArrays([e.path], e.middleware_functions)) : routable.use.apply(routable, __spreadArrays([e.path], e.middleware_functions)); });
    };
    Routable.prototype.setup_methods = function (added_methods) {
        var _this = this;
        this.get_added_methods().forEach(function (e) {
            var _a;
            (_a = _this.routable_object)[e.http_method].apply(_a, __spreadArrays([e.path], (e.middlewares.map(function (middleware) { return typeof middleware === 'function'
                ? middleware
                : middleware.handle.bind(middleware); })), [// VS  (req: any, res: any, next: any) => middleware.handle(req, res, next))),
                _this.method_creator(e)]));
        });
    };
    /**
     * Creates callable method for the endpoint
     * TODO :: Minimize overhead
     * @param e
     * @protected
     */
    Routable.prototype.method_creator = function (e) {
        var _this = this;
        return function (request, response, next) {
            var parameters = [];
            if (e.method_parameters.length === 0) {
                parameters.push(request, response, next);
            }
            else {
                // TODO :: Parameter placement ? What if the first parameter is not 0.th
                e.method_parameters.sort(function (a, b) { return a.parameter_index > b.parameter_index ? 1 : -1; });
                if (e.method_parameters[0].parameter_index !== 0) {
                    throw new Error('What should I do here?? Pass Request, Response, Next, All-of-them ?');
                }
                e.method_parameters.forEach(function (parameter) {
                    switch (parameter.parameter_type) {
                        case "request":
                            parameters.push(request);
                            return;
                        case "response":
                            parameters.push(response);
                            return;
                        case "next":
                            parameters.push(next);
                            return;
                    }
                    if (!parameter.extra_data) {
                        throw new Error('extra_data should be defined here || Return undefined? ');
                    }
                    switch (parameter.parameter_type) {
                        case "path":
                        case "parameter":
                            parameters.push(request.params[parameter.extra_data.variable_path]);
                            break;
                        case "query":
                            parameters.push(request.query[parameter.extra_data.variable_path]);
                            break;
                        case "body":
                            parameters.push(request.body[parameter.extra_data.variable_path]);
                            break;
                        case "cookie":
                            parameters.push(request.cookies[parameter.extra_data.variable_path]);
                            // TODO :: How to tell the difference?
                            // parameters.push(request.signedCookies[parameter.extra_data.variable_path]);
                            break;
                    }
                });
            }
            var wrapper = _this.get_result_wrapper();
            //@ts-ignore
            var result = _this[e.object_method].apply(_this, parameters);
            if (wrapper && !response.headersSent) { // What happens if they call the next function
                wrapper({ result: result, request: request, response: response, next: next });
            }
        };
    };
    return Routable;
}());
exports.Routable = Routable;
