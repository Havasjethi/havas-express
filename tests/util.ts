import request from "supertest";
import { App } from "../index";


export const get_request_creator = (app: App) => (path: string): request.Test => request(app.get_initialized_routable()).get(path);
