"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Host = exports.ResultWrapper = exports.Path = void 0;
var class_decorator_util_1 = require("../util/class_decorator_util");
function Path(path) {
    return class_decorator_util_1.SetProperty(function (object) { return object.set_path(path); });
}
exports.Path = Path;
function ResultWrapper(result_wrapper_method) {
    return class_decorator_util_1.SetProperty(function (element) {
        element.set_result_wrapper(result_wrapper_method);
    });
}
exports.ResultWrapper = ResultWrapper;
function Host(_a) {
    var _b = _a.port_number, port_number = _b === void 0 ? -1 : _b, _c = _a.host, host = _c === void 0 ? 'localhost' : _c, _d = _a.auto_start, auto_start = _d === void 0 ? false : _d;
    return function (class_definition) {
        var constructor = class_decorator_util_1.extender.add_set_property(class_definition, function (app) {
            app.port = typeof (port_number) === 'string' ? parseInt(port_number, 10) : port_number;
            app.host = host;
        });
        if (auto_start) {
            class_decorator_util_1.extender.add_after_initialization(class_definition, function (app) {
                app.start_app();
            });
        }
        return constructor;
    };
}
exports.Host = Host;
