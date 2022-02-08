import { Path, ResultWrapper, App, Get, Router, UseMiddleware } from '../index';
import bodyParser from 'body-parser';
const middlewareFunction1 = (_: any, __: any, next: any) => next();
const middlewareFunction2 = (_: any, __: any, next: any) => next();

@UseMiddleware(bodyParser.json())
class TestApp extends App {
  @Get('/', middlewareFunction1, middlewareFunction2)
  index(req: any, res: any) {
    res.send('Nice');
  }
}

@Path('/router')
@ResultWrapper(({ response, result }) => response.send({ data: result }))
class TestRouter extends Router {
  @Get('/')
  index() {
    return 'Index';
  }

  @Get('/:asd')
  any_path() {
    return 13;
  }
}

export const test_app_instance = new TestApp();
const test_router = new TestRouter();
test_app_instance.append(test_router);
test_app_instance.start_stop_logging = false;
