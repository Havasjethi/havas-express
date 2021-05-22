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
var index_1 = require("../index");
var MainApp = /** @class */ (function (_super) {
    __extends(MainApp, _super);
    function MainApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainApp.prototype.index = function (req, res) {
        res.send('Index page message.');
    };
    __decorate([
        index_1.Get('/'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], MainApp.prototype, "index", null);
    MainApp = __decorate([
        index_1.Host({
            auto_start: false,
            host: 'localhost',
            port_number: 3000,
        }),
        index_1.UseMiddleware((function (req, res, next) {
            console.log('Got a new request');
            next();
        }))
    ], MainApp);
    return MainApp;
}(index_1.App));
var UserController = /** @class */ (function (_super) {
    __extends(UserController, _super);
    function UserController() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UserController_1 = UserController;
    UserController.prototype.index = function (id) {
        return {
            id: id,
            controller: UserController_1.name,
            method: 'index',
        };
    };
    UserController.prototype.login = function (user) {
        // Business logic
        return {};
    };
    var UserController_1;
    __decorate([
        index_1.Get('/:id'),
        __param(0, index_1.PathVariable('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Number]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "index", null);
    __decorate([
        index_1.Post('/login'),
        __param(0, index_1.Body('user')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "login", null);
    UserController = UserController_1 = __decorate([
        index_1.Path('/user'),
        index_1.ResultWrapper(function (_a) {
            var result = _a.result, response = _a.response;
            return response.send({
                success: true,
                data: result,
            });
        })
    ], UserController);
    return UserController;
}(index_1.Router));
var app = new MainApp();
var user_controller = new UserController();
app
    .append(user_controller)
    .start_app();
