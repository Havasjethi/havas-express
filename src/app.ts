import express from "express";

export abstract class App {
  private some: express.Application | undefined;

  create_app () {
    this.some = express();
    return this.some;
  }
}
