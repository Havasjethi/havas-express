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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.__testAppWithMethodDecorators = void 0;
var index_1 = require("../../index");
var body_parser = require('body-parser');
var cookie_parser = require('cookie-parser');
var TestAppWithMethodDecorators = /** @class */ (function (_super) {
    __extends(TestAppWithMethodDecorators, _super);
    function TestAppWithMethodDecorators() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestAppWithMethodDecorators = __decorate([
        index_1.Host({
            port_number: 4343,
            host: 'loclhost',
            auto_start: false,
        })
    ], TestAppWithMethodDecorators);
    return TestAppWithMethodDecorators;
}(index_1.App));
var Router1 = /** @class */ (function (_super) {
    __extends(Router1, _super);
    function Router1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Router1.prototype.index = function (res) {
        res.send('index');
    };
    Router1.prototype.post_index = function (res) {
        res.send('post_index');
    };
    Router1.prototype.delete_index = function (res) {
        res.send('delete_index');
    };
    Router1.prototype.user = function (res, user) {
        return user.name;
    };
    Router1.prototype.param_extract = function (p1) {
        return p1;
    };
    Router1.prototype.cookie_extract = function (c1) {
        return c1;
    };
    Router1.prototype.extract_from_path = function (path_id, param_id) {
        return {
            param: param_id,
            path: path_id,
        };
    };
    __decorate([
        index_1.Get('/'),
        __param(0, index_1.ResponseObj),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Router1.prototype, "index", null);
    __decorate([
        index_1.Post('/'),
        __param(0, index_1.ResponseObj),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Router1.prototype, "post_index", null);
    __decorate([
        index_1.Delete('/'),
        __param(0, index_1.ResponseObj),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Router1.prototype, "delete_index", null);
    __decorate([
        index_1.Post('/user'),
        __param(0, index_1.ResponseObj), __param(1, index_1.Body('user')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Router1.prototype, "user", null);
    __decorate([
        index_1.Post('/param_extract'),
        __param(0, index_1.Query('p1')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Router1.prototype, "param_extract", null);
    __decorate([
        index_1.Post('/cookie_extract'),
        __param(0, index_1.Cookie('user_name')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Router1.prototype, "cookie_extract", null);
    __decorate([
        index_1.Post('/some/:id'),
        __param(0, index_1.PathVariable('id')), __param(1, index_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], Router1.prototype, "extract_from_path", null);
    Router1 = __decorate([
        index_1.Path('/a'),
        index_1.UseMiddleware(body_parser.json()),
        index_1.UseMiddleware(cookie_parser()),
        index_1.ResultWrapper(function (_a) {
            var result = _a.result, response = _a.response;
            return response.send(result);
        })
    ], Router1);
    return Router1;
}(index_1.Router));
var router_1 = new Router1();
exports.__testAppWithMethodDecorators = new TestAppWithMethodDecorators();
exports.__testAppWithMethodDecorators.append(router_1);
