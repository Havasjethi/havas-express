import { App, ExpressRequest } from "../index";
declare class TestApp extends App {
    index(req: any, res: any): void;
    index2(req: ExpressRequest, res: any): void;
}
export declare const test_app_instance: TestApp;
export {};
