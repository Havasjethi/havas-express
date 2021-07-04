import {
  Get,
  Path,
  Host,
  App,
  Router,
  ResponseObj,
  Post,
  Delete,
  Body,
  ResultWrapper,
  UseMiddleware, RequestObj, Param, Cookie, Query, PathVariable
} from '../../index';
const body_parser = require('body-parser');
const cookie_parser = require('cookie-parser');

@Host({
  port: 4343,
  host: 'localhost',
  auto_start: false,
})
class TestAppWithMethodDecorators extends App {}

@Path('/a')
@UseMiddleware(body_parser.json())
@UseMiddleware(cookie_parser())
@ResultWrapper(({result,response}) => response.send(result))
class TestRouter extends Router {

  @Get('/')
  index (@ResponseObj res: any) {
    res.send('index');
  }

  @Post('/')
  post_index(@ResponseObj res: any) {
    res.send('post_index');
  }

  @Delete('/')
  delete_index(@ResponseObj res: any) {
    res.send('delete_index');
  }

  @Post('/user')
  user (@ResponseObj res: any, @Body('user') user: any) {
    return user.name;
  }


  @Post('/param_extract')
  param_extract (@Query('p1') p1: any) {
    return p1;
  }

  @Post('/cookie_extract')
  cookie_extract (@Cookie('user_name') c1: any) {
    return c1;
  }

  @Post('/some/:id')
  extract_from_path (@PathVariable('id') path_id: any, @Param('id') param_id: any) {
    return {
      param: param_id,
      path: path_id,
    };
  }

}

const router_1 = new TestRouter();
export const __testAppWithMethodDecorators = new TestAppWithMethodDecorators();

__testAppWithMethodDecorators.append(router_1);
