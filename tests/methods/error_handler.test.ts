import 'reflect-metadata';
import request from 'supertest';
import {
  App,
  Path,
  Router,
  ErrorHandler,
  Get,
  ErrorHandlerMethod,
  initializeControllers,
  MainController,
  Controller,
  ExpressCoreRoutable,
  PipeErrorHandler,
  ExpressResponse,
  Request,
  Response,
  ResponseObj,
  Err,
} from '../../index';
import { get_request_creator } from "../util";

const ERROR_MESSAGES = {
  main_app: 'TestApp - main_app',
  router: 'TestApp - router',
  method_error: 'TestApp - method',
  decorated_error: 'TestApp - decorated_error',
};

@MainController
@ErrorHandler(((err, req, res, next) => {
  res.send(ERROR_MESSAGES.main_app);
}))
class TestApp extends App {

  @Get('/')
  index () {
    throw new Error('TestApp MEH');
  }
}

@Controller()
@Path('/router')
@ErrorHandler((err, req, res, next) => {
  res.send(ERROR_MESSAGES.router);
})
class TestRouter extends Router {

  @Get('/')
  index () {
    throw new Error('TestRouter MEH');
  }
}

@Controller()
@Path('/router-2')
@ErrorHandler(new PipeErrorHandler(parameters => {
  console.log('Some logging')
}))
class TestRouterWithPipeErrorHandler extends Router {

  @Get('/')
  index () {
    throw new Error('TestRouterWithPipeErrorHandler MEH');
  }
}

@Controller()
@Path('/method-related')
class SomeRouter extends Router {

  @ErrorHandlerMethod
  error_handler_method(err: Error, req: Request, res: Response) {
    res.send(ERROR_MESSAGES.method_error);
  }

  @Get('/')
  index() {
    throw new Error('');
  }
}

@Controller()
class SomeRouterR extends Router {

  @ErrorHandlerMethod
  error_handler_method(
    @ResponseObj res: ExpressResponse,
    @Err error: Error,
  ): any {
    res.send(error.message);
  }

  @Get('/method-related-plus')
  index() {
    throw new Error(ERROR_MESSAGES.decorated_error);
  }
}

describe('Test error handlers', () => {
  let controllers: ExpressCoreRoutable[];
  let get: (path: string) => request.Test;

  beforeAll(async () => {
    controllers = await initializeControllers({kind: 'none'});
    get = get_request_creator(controllers[0]);
  });

  test('Application attached error handler works', async () =>
    await get('/')
      .expect((res) => expect(res.text).toBe(ERROR_MESSAGES.main_app))
  );

  test('Router specific error handler called before MainApplication', async () =>
    await get('/router')
      .expect((res) => expect(res.text).toBe(ERROR_MESSAGES.router))
  );

  test('Router error falls back to if not handled', async () =>
    await get('/router-2')
      .expect((res) => expect(res.text).toBe(ERROR_MESSAGES.main_app))
  );

  test('<TODO>', async () =>
    await get('/method-related')
      .expect((res) => expect(res.text).toBe(ERROR_MESSAGES.method_error))
  );

  test('<TODO 2>', async () =>
    await get('/method-related-plus')
      .expect((res) => expect(res.text).toBe(ERROR_MESSAGES.decorated_error))
  );
});
