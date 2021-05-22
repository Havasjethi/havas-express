/// <reference types="node" />
import express from "express";
import { Server } from "node:http";
import { Routable } from "./classes/routable";
export declare abstract class App extends Routable<express.Application> {
    path: string;
    host: string;
    port: number;
    protected running_server: Server | undefined;
    protected _start_stop_logging: boolean;
    constructor();
    set start_stop_logging(value: boolean);
    remove_layers(): void;
    start_app(): void;
    stop(on_stop_callback?: () => any): void;
}
