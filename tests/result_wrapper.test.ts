import 'reflect-metadata';
import assert from 'assert';
import express from 'express';
import supertest from 'supertest';
import {
  App, ExpressCoreRoutable,
  Get,
  initializeControllers,
  MainController,
  Path,
  Response,
  ResultWrapper,
  Router,
} from '../index';
import { Res, Result } from '../src/decorators/parameter_decorators';


const MESSAGES = {
  MAIN_METHOD: 'MAIN_METHOD',
  SUB_1_WRAPPER: 'SUB_1_METHOD',
  SUB_2_METHOD: 'SUB_2_METHOD',
};


@MainController
@ResultWrapper(({result, response}) => {
  response.send(result);
})
class MainApp extends App {

  @Get('/main')
  method () {
    return MESSAGES.MAIN_METHOD;
  }
}


@Path('/sub-1')
class SubController_1 extends Router {

  @ResultWrapper
  wrapper_method (
    @Res response: Response,
  ) {
    response.send(MESSAGES.SUB_1_WRAPPER);
  }

  @Get('')
  sub_method ( ) {
    return null;
  }

}


@Path('/sub-2')
class SubController_2 extends Router {

  @ResultWrapper
  wrapper_method (
    @Result result: any,
    @Res response: Response,
  ) {
    response.send(result);
  }

}


describe('Result Wrapper Tests ', () => {
  let app: express.Application;

  beforeAll(async() => {
    const initialized_items = await initializeControllers({kind: 'none'});

    assert(initialized_items.length != 0, 'Controllers initialization failed!');
    app = (initialized_items[0] as App).getInitializedRoutable();
  })

  describe('Method Level', () => {
    test('Default', (done) => {
      supertest(app)
        .get('/main')
        .expect(res => expect(res.text).toBe(MESSAGES.MAIN_METHOD), done);
    });

    test('Layering', (done) => {
      supertest(app)
        .get('/sub-1')
        .expect(res => expect(res.text).toBe(MESSAGES.SUB_1_WRAPPER), done);
    });
  });
});
