import {
  App,
  Body,
  Get,
  Host,
  Path,
  PathVariable,
  Post,
  ResultWrapper,
  Router,
  UseMiddleware,
} from '../index';
import { ExpressFunction } from '../src/classes/types/middleware';

@Host({
  auto_start: false,
  host: 'localhost',
  port: 3000,
})
@UseMiddleware(((req, res, next) => {
  console.log('Got a new request');
  next();
}) as ExpressFunction)
class MainApp extends App {
  @Get('/')
  index(req: any, res: any) {
    res.send('Index page message.');
  }
}

@Path('/user')
@ResultWrapper(({ result, response }) =>
  response.send({
    success: true,
    data: result,
  }),
)
class UserController extends Router {
  @Get('/:id')
  index(@PathVariable('id') id: number) {
    return {
      id: id,
      controller: UserController.name,
      method: 'index',
    };
  }

  @Post('/login')
  login(@Body('user') user: any) {
    // Business logic

    return {};
  }
}

const app = new MainApp();
const user_controller = new UserController();

app.append(user_controller).start_app();
