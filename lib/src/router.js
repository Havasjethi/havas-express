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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
var express_1 = require("express");
var routable_1 = require("./classes/routable");
var Router = /** @class */ (function (_super) {
    __extends(Router, _super);
    // public static path: string = '/';
    function Router() {
        return _super.call(this, express_1.Router()) || this;
    }
    Router.prototype.remove_layers = function () {
        this.get_routable().stack.splice(0);
    };
    return Router;
}(routable_1.Routable));
exports.Router = Router;
