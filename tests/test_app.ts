import { Path, ResultWrapper, Host, App, Get, Router, ExpressRequest } from '../index';

const port = 4001;
const host = 'localhost';
const auto_start = false;

@Host({
  port,
  host: host,
  auto_start: auto_start,
})
class TestApp extends App {
  @Get('/')
  index(req: any, res: any) {
    res.send('Nice');
  }

  @Get('/13')
  index2(req: ExpressRequest, res: any) {
    res.send({ any: 13 });
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
