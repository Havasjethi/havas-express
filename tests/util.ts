import get_port from "get-port";
import request from "supertest";
import { App } from "../index";


export const get_free_port = async () => {
  return await get_port();
};

export const init_app = async (app: App): Promise<App> => {
  app.options.port = await get_free_port();
  return app;
};

export const get_request_creator = (app: App) => (path: string): request.Test =>
  request(app.get_initialized_routable()).get(path);
