import { App, Host, Path, Router, ErrorHandler, Get } from "../../index";
import { PipeErrorHandler } from "../../src/classes/error_handler";
import { get_request_creator } from "../util";

const error_handler_message_main_app = 'TestApp - Error handled!';
const error_handler_message_router = 'TestApp - Error handled!';

@Host({port: 42342})
@ErrorHandler(((err, req, res, next) => {
  console.log('Error: err');
  res.send(error_handler_message_main_app);
}))
class TestApp extends App {

  @Get('/')
  index () {
    throw new Error('TestApp MEH');
  }
}

@Path('/router')
@ErrorHandler((err, req, res, next) => {
  console.log('Error in TestRouter:  err');
  res.send(error_handler_message_router);
})
class TestRotuer extends Router {

  @Get('/')
  index () {
    throw new Error('TestRotuer MEH');
  }
}

@Path('/router-2')
@ErrorHandler(new PipeErrorHandler(parameters => {
  console.log('Some logging')
}))
class TestRotuerWithPipeErrorHandler extends Router {

  @Get('/')
  index () {
    throw new Error('TestRotuerWithPipeErrorHandler MEH');
  }
}


describe('Test error handlers', () => {

  const app = new TestApp();
  const rotuer_1 = new TestRotuer();
  const rotuer_2 = new TestRotuerWithPipeErrorHandler();
  app
    .append(rotuer_1)
    .append(rotuer_2);

  const get = get_request_creator(app);

  test('Test 1', async () =>
    await get('/')
      .expect((res) => expect(res.text).toBe(error_handler_message_main_app))
  );

  test('Test 2', async () =>
    await get('/router')
      .expect((res) => expect(res.text).toBe(error_handler_message_router))
  );

  test('Test 3', async () =>
    await get('/router-2')
      .expect((res) => expect(res.text).toBe(error_handler_message_main_app))
  );
});
