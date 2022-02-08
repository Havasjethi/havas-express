import { App, AsyncPipeMiddleware, ExpressRequest, ExpressResponse, Get, Path, PipeMiddleware } from "../../index";
import { get_request_creator } from '../util';


const some_pipe_middleware = new class extends PipeMiddleware {
  public handle_method (req: ExpressRequest, res: ExpressResponse): void {

  }

};
const some_async_pipe_middleware = new class extends AsyncPipeMiddleware {
  public async handle_method (req: ExpressRequest, res: ExpressResponse): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(), 2000),
    );
  }
};


@Path("/")
class A extends App {

  @Get('/endpoint_1', some_pipe_middleware)
  endpoint_1 (req: any, res: any) {
    res.send('OK');
  }

  @Get('/endpoint_2', some_async_pipe_middleware)
  endpoint_2 (req: any, res: any) {
    res.send('OK');
  }
}


describe('Pipe Middlewares', () => {
  const app = new A();
  const get_creator = get_request_creator(app);

  test('Sync middleware test', async () => {
    await get_creator('/endpoint_1')
      .expect(res => expect(res.text).toBe('OK'));
  });

  test('Async Middleware test', async () => {
    await get_creator('/endpoint_2')
      .expect(res => expect(res.text).toBe('OK'));
  });
});
