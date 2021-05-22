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
describe('@SetProperty tests', function () {
    var ClassA = /** @class */ (function () {
        function ClassA(some_name) {
            if (some_name === void 0) { some_name = ''; }
            this.some_name = some_name;
        }
        ClassA.x = 13;
        ClassA = __decorate([
            class_decorator_util_1.SetProperty(function (instance) { instance.some_name = instance.some_name.toUpperCase(); }),
            __metadata("design:paramtypes", [String])
        ], ClassA);
        return ClassA;
    }());
    var ClassB = /** @class */ (function () {
        function ClassB(x) {
            this.x = x;
        }
        ClassB = __decorate([
            class_decorator_util_1.SetProperty(function (instance) { instance.x += 1; }),
            class_decorator_util_1.SetProperty(function (instance) { instance.x += 1; }),
            __metadata("design:paramtypes", [Number])
        ], ClassB);
        return ClassB;
    }());
    function Add_To_X(value) {
        return class_decorator_util_1.SetProperty(function (instance) { return instance.x += value; });
    }
    var ClassC = /** @class */ (function (_super) {
        __extends(ClassC, _super);
        function ClassC() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClassC = __decorate([
            Add_To_X(10)
        ], ClassC);
        return ClassC;
    }(ClassB));
    var random_string = 'random_string';
    test('ClassA works', function () {
        var a_instance = new ClassA(random_string);
        expect(a_instance.some_name).toEqual(random_string.toUpperCase());
    });
    test('ClassB works', function () {
        var b_instance_1 = new ClassB(3);
        var b_instance_2 = new ClassB(5);
        expect(b_instance_1.x).toBe(3 + 2);
        expect(b_instance_2.x).toBe(5 + 2);
    });
    test('ClassB works', function () {
        var c_instance = new ClassC(-1);
        expect(c_instance.x).toBe(-1 + (2 + 10));
    });
});
