import 'reflect-metadata';
import {
  MainController,
  App,
  Get,
  Router,
  ExpressRequest,
  ExpressResponse,
  Controller,
} from '../../../../index';

@MainController
export class TheMainController extends App {

  @Get('/')
  index(req: ExpressRequest, res: ExpressResponse) {
    res.sendStatus(200);
  }
}
