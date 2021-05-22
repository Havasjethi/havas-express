"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_decorator_util_1 = require("../../src/util/class_decorator_util");
var value_to_reset = 13;
var ClassA = /** @class */ (function () {
    function ClassA() {
        this.x = 0;
    }
    ClassA.static_property = 13;
    ClassA = __decorate([
        class_decorator_util_1.BeforeCreate(function (e) {
            value_to_reset = 0;
            e.static_property += 1;
        })
    ], ClassA);
    return ClassA;
}());
describe('@BeforeCreate tests', function () {
    test('@BeforeCreate works', function () {
        var before = ClassA.static_property;
        new ClassA();
        expect(before + 1).toBe(ClassA.static_property);
    });
});
