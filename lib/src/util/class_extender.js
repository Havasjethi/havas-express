"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassExtender = void 0;
var ClassExtender = /** @class */ (function () {
    function ClassExtender() {
        this.decorations = {};
    }
    ClassExtender.prototype.get_or_initialize = function (original_constructor) {
        // @ts-ignore
        var class_name = original_constructor.prototype.constructor.name;
        if (!this.decorations[class_name]) {
            this.decorations[class_name] = this.initialize(original_constructor);
        }
        return this.decorations[class_name];
    };
    ClassExtender.prototype.initialize = function (original_constructor) {
        var stored_item = {
            before_initialization: [],
            set_properties: [],
            after_initialization: [],
            //@ts-ignore
            new_constructor: null,
        };
        var new_constructor = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var wrapped_constructor = function () {
                var new_instance = new (original_constructor.bind.apply(original_constructor, __spreadArrays([void 0], args)))();
                stored_item.set_properties.forEach(function (fnc) { return fnc(new_instance); });
                return new_instance;
            };
            wrapped_constructor.prototype = original_constructor.prototype;
            stored_item.before_initialization.forEach(function (e) { return e(new_constructor); });
            var instance = wrapped_constructor();
            stored_item.after_initialization.forEach(function (e) { return e(instance); });
            return instance;
        };
        new_constructor.prototype = original_constructor.prototype;
        stored_item.new_constructor = new_constructor;
        return stored_item;
    };
    ClassExtender.prototype.add_before_initialization = function (original_constructor, before_initialization) {
        var stored_item = this.get_or_initialize(original_constructor);
        stored_item.before_initialization.push(before_initialization);
        return stored_item.new_constructor;
    };
    ClassExtender.prototype.add_set_property = function (original_constructor, set_property) {
        var stored_item = this.get_or_initialize(original_constructor);
        stored_item.set_properties.push(set_property);
        return stored_item.new_constructor;
    };
    ClassExtender.prototype.add_after_initialization = function (original_constructor, after_initialization) {
        var stored_item = this.get_or_initialize(original_constructor);
        stored_item.after_initialization.push(after_initialization);
        return stored_item.new_constructor;
    };
    return ClassExtender;
}());
exports.ClassExtender = ClassExtender;
