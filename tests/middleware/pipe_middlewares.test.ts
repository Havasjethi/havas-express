import { expect } from 'chai';
import {
  App,
  AsyncPipeMiddleware,
  ExpressRequest,
  ExpressResponse,
  Get,
  Path,
  PipeMiddleware,
} from '../../index';
import request from "supertest";

const some_pipe_middleware = new (class extends PipeMiddleware {
  public handle_method(req: ExpressRequest, res: ExpressResponse): void {}
})();
const some_async_pipe_middleware = new (class extends AsyncPipeMiddleware {
  public async handle_method(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(), 2000));
  }
})();


describe('Pipe Middlewares', () => {
  /**
   * TODO :: Resolve class-name separation for Mocha !!!
   *  - class A {} conflicts with class A extends App {}
   */
  @Path('/')
  class _A extends App {
    @Get('/endpoint_1', some_pipe_middleware)
    endpoint_1(req: any, res: any) {
      res.send('OK');
    }

    @Get('/endpoint_2', some_async_pipe_middleware)
    endpoint_2(req: any, res: any) {
      res.send('OK');
    }
  }

  const app = new _A();
  const getCreator = (str: string) => request(app.getInitializedRoutable()).get(str);

  console.log(app);

  it('endpoint_1', async () => {
    await getCreator('/endpoint_1').expect((res) => expect(res.text).equal('OK'));
  });

  it('endpoint_2', async () => {
    await getCreator('/endpoint_2').expect((res) => expect(res.text).equal('OK'));
  });
});
