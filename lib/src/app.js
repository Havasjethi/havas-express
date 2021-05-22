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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
var express_1 = __importDefault(require("express"));
var routable_1 = require("./classes/routable");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App() {
        var _this = _super.call(this, express_1.default()) || this;
        _this.path = '/';
        _this.host = 'localhost';
        _this.port = -1;
        _this._start_stop_logging = true;
        _this.running_server = undefined;
        return _this;
    }
    Object.defineProperty(App.prototype, "start_stop_logging", {
        set: function (value) {
            this._start_stop_logging = value;
        },
        enumerable: false,
        configurable: true
    });
    App.prototype.remove_layers = function () {
        this.get_routable()._router.stack.splice(2);
    };
    App.prototype.start_app = function () {
        var _this = this;
        if (!this.layers_initialized) {
            this.setup_layers();
        }
        this.running_server = this.routable_object.listen(this.port, this.host, function () {
            if (_this._start_stop_logging) {
                console.log("App is active: http://" + _this.host + ":" + _this.port);
            }
        });
    };
    App.prototype.stop = function (on_stop_callback) {
        var _this = this;
        if (on_stop_callback === void 0) { on_stop_callback = function () { }; }
        if (this.running_server) {
            this.running_server.close(function () {
                delete _this.running_server;
                if (_this._start_stop_logging) {
                    console.log("Server stopped listening to http://" + _this.host + ":" + _this.port);
                }
                on_stop_callback();
            });
        }
    };
    return App;
}(routable_1.Routable));
exports.App = App;
