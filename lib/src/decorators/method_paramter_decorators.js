"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = exports.Param = exports.PathVariable = exports.Body = exports.Cookie = exports.Next = exports.ResponseObj = exports.RequestObj = void 0;
var RequestObj = function (target, method_name, parameter_index) {
    target.add_method_parameter(method_name, 'request', parameter_index);
};
exports.RequestObj = RequestObj;
var ResponseObj = function (target, method_name, parameter_index) {
    target.add_method_parameter(method_name, 'response', parameter_index);
};
exports.ResponseObj = ResponseObj;
var Next = function (target, method_name, parameter_index) {
    target.add_method_parameter(method_name, 'next', parameter_index);
};
exports.Next = Next;
//
// TODO :: Derefer name by method_name & position (index) position
//         Only found solution: stackoverflow.com/questions/1007981
//
var Cookie = function (name) {
    return function (target, method_name, parameter_index) {
        target.add_method_parameter(method_name, 'cookie', parameter_index, {
            variable_path: name
        });
    };
};
exports.Cookie = Cookie;
var Body = function (name) {
    return function (target, method_name, parameter_index) {
        target.add_method_parameter(method_name, 'body', parameter_index, {
            variable_path: name
        });
    };
};
exports.Body = Body;
var PathVariable = function (name) {
    return function (target, method_name, parameter_index) {
        target.add_method_parameter(method_name, 'path', parameter_index, {
            variable_path: name
        });
    };
};
exports.PathVariable = PathVariable;
var Param = function (name) {
    return function (target, method_name, parameter_index) {
        target.add_method_parameter(method_name, 'parameter', parameter_index, {
            variable_path: name
        });
    };
};
exports.Param = Param;
var Query = function (name) {
    return function (target, method_name, parameter_index) {
        target.add_method_parameter(method_name, 'query', parameter_index, {
            variable_path: name
        });
    };
};
exports.Query = Query;
