"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.class_extender = exports.AfterCreate = exports.SetProperty = exports.BeforeCreate = exports.extender = void 0;
var class_extender_1 = require("./class_extender");
exports.extender = new class_extender_1.ClassExtender();
function BeforeCreate(after_create) {
    return function (modifiable_constructor) { return exports.extender.add_before_initialization(modifiable_constructor, after_create); };
}
exports.BeforeCreate = BeforeCreate;
function SetProperty(set_property) {
    return function (modifiable_constructor) { return exports.extender.add_set_property(modifiable_constructor, set_property); };
}
exports.SetProperty = SetProperty;
function AfterCreate(after_create) {
    return function (modifiable_constructor) { return exports.extender.add_after_initialization(modifiable_constructor, after_create); };
}
exports.AfterCreate = AfterCreate;
/**
 * The method has been deprecated, by the superior ClassExtender, which creates a lifecycle around item creation
 * @see ClassExtender
 * @deprecated
 * @param after_construct
 */
function class_extender(after_construct) {
    return function (old_class) {
        var new_class = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var new_constructor = function () { return new (old_class.bind.apply(old_class, __spreadArrays([void 0], args)))(); };
            new_constructor.prototype = old_class.prototype;
            var instance = new_constructor();
            /**
             * This after_creations could be collected into an array, then executed!
             * Note: Added in
             */
            after_construct(instance);
            return instance;
        };
        new_class.prototype = old_class.prototype;
        return new_class;
    };
}
exports.class_extender = class_extender;
