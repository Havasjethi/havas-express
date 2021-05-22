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
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../index");
describe('Application test', function () {
    var port = 4000;
    var host = 'localhost';
    var auto_start = false;
    var EmptyTestApp = /** @class */ (function (_super) {
        __extends(EmptyTestApp, _super);
        function EmptyTestApp() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EmptyTestApp = __decorate([
            index_1.Host({
                port_number: port,
                host: host,
                auto_start: auto_start,
            })
        ], EmptyTestApp);
        return EmptyTestApp;
    }(index_1.App));
    var test_app = new EmptyTestApp();
    test('Port setting is correct', function () {
        expect(test_app.port).toEqual(port);
    });
    test('Host setting is correct', function () {
        expect(test_app.host).toEqual(host);
    });
    test('Path is the default', function () {
        expect(test_app.path).toEqual('/');
    });
});
