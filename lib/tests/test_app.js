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
exports.test_app_instance = void 0;
var index_1 = require("../index");
var port = 4001;
var host = 'localhost';
var auto_start = false;
var TestApp = /** @class */ (function (_super) {
    __extends(TestApp, _super);
    function TestApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestApp.prototype.index = function (req, res) {
        res.send('Nice');
    };
    TestApp.prototype.index2 = function (req, res) {
        res.send({ any: 13 });
    };
    __decorate([
        index_1.Get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TestApp.prototype, "index", null);
    __decorate([
        index_1.Get('/13'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], TestApp.prototype, "index2", null);
    TestApp = __decorate([
        index_1.Host({
            port_number: port,
            host: host,
            auto_start: auto_start,
        })
    ], TestApp);
    return TestApp;
}(index_1.App));
var TestRouter = /** @class */ (function (_super) {
    __extends(TestRouter, _super);
    function TestRouter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestRouter.prototype.index = function () {
        return 'Index';
    };
    TestRouter.prototype.any_path = function () {
        return 13;
    };
    __decorate([
        index_1.Get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TestRouter.prototype, "index", null);
    __decorate([
        index_1.Get('/:asd'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], TestRouter.prototype, "any_path", null);
    TestRouter = __decorate([
        index_1.Path('/router'),
        index_1.ResultWrapper(function (_a) {
            var response = _a.response, result = _a.result;
            return response.send({ data: result });
        })
    ], TestRouter);
    return TestRouter;
}(index_1.Router));
exports.test_app_instance = new TestApp();
var test_router = new TestRouter();
exports.test_app_instance.append(test_router);
exports.test_app_instance.start_stop_logging = false;
