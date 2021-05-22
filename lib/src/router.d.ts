import { Router as ExpressRouter } from "express";
import { Routable } from "./classes/routable";
export declare class Router extends Routable<ExpressRouter> {
    constructor();
    remove_layers(): void;
}
