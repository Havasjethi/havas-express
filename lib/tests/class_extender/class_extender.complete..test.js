"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var class_decorator_util_1 = require("../../src/util/class_decorator_util");
var A = /** @class */ (function () {
    function A(num) {
        if (num === void 0) { num = undefined; }
        this.x = num !== null && num !== void 0 ? num : A_1.default_x;
    }
    A_1 = A;
    var A_1;
    A.default_x = -1;
    A = A_1 = __decorate([
        class_decorator_util_1.BeforeCreate(function (class_decl) { class_decl.default_x = 100; }),
        class_decorator_util_1.SetProperty(function (instance) { instance.x += 3; }),
        class_decorator_util_1.AfterCreate(function (instance) { instance.x *= 2; }),
        class_decorator_util_1.SetProperty(function (instance) { instance.x += 10; }),
        __metadata("design:paramtypes", [Object])
    ], A);
    return A;
}());
describe('Test Of Correct lifecycles', function () {
    test('Whole lifecycle of object A #1', function () {
        var a = new A();
        expect(a.x).toBe((100 + 3 + 10) * 2);
    });
    test('Whole lifecycle of object A #2', function () {
        var a = new A(3);
        expect(a.x).toBe((3 + 3 + 10) * 2);
    });
});
