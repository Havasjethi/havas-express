import {
  Path,
  ResultWrapper,
  Host,
  App,
  Get,
  Router,
  ExpressRequest,
  UseMiddleware,
} from '../index';

const port = 4001;
const host = 'localhost';
const auto_start = false;

const middleWarefucntion1 = () => {};
const middleWarefucntion2 = () => {};
const bodyParser = require('body-parser');

@UseMiddleware(bodyParser.json())
class TestApp extends App {
  @Get('/', middleWarefucntion1, middleWarefucntion2)
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
