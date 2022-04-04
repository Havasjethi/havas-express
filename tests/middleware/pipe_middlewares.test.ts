import { IRouter } from 'express';
import supertest from 'supertest';
import {
  App,
  AsyncPipeMiddleware,
  Component,
  Controller,
  ExpressRequest,
  ExpressResponse,
  Get,
  Path,
  PipeMiddleware,
  UseMiddleware,
} from '../../index';
import { initializeControllers } from '../../src/di';
import 'reflect-metadata';

const FIELD_TO_ADD = 'FIELD_TO_ADD';
const FIELD_VALUES = {
  endpoint_1: 'endpoint_1',
  endpoint_2: 'endpoint_2',
  endpoint_3: 'endpoint_3',
};

const some_pipe_middleware = new (class extends PipeMiddleware {
  public handle(req: ExpressRequest, res: ExpressResponse): void {
    // @ts-ignore
    req[FIELD_TO_ADD] = FIELD_VALUES.endpoint_1;
  }
})();

const some_async_pipe_middleware = new (class extends AsyncPipeMiddleware {
  public async handle(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    // @ts-ignore
    req[FIELD_TO_ADD] = FIELD_VALUES.endpoint_2;
    return new Promise((resolve) => setTimeout(() => resolve(), 2000));
  }
})();

@Component()
class ClassMiddleware extends AsyncPipeMiddleware {
  public async handle(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    // @ts-ignore
    req[FIELD_TO_ADD] = FIELD_VALUES.endpoint_3;
  }
}

@Controller()
@UseMiddleware(ClassMiddleware)
@Path('/')
class A extends App {
  @Get('/endpoint_1', some_pipe_middleware)
  endpoint_1(req: any, res: any) {
    res.send(req[FIELD_TO_ADD]);
  }

  @Get('/endpoint_2', some_async_pipe_middleware)
  endpoint_2(req: any, res: any) {
    res.send(req[FIELD_TO_ADD]);
  }

  @Get('/endpoint_3/')
  endpoint_3(req: any, res: any) {
    res.send(req[FIELD_TO_ADD]);
  }
}

describe('Pipe Middlewares', () => {
  let router: IRouter;

  beforeAll(async () => {
    const result = await initializeControllers({ kind: 'none' });

    expect(result).not.toHaveLength(0);
    router = result[0].getInitializedRoutable();
  });

  test('Sync middleware test', async () => {
    await supertest(router)
      .get('/endpoint_1')
      .expect((res) => expect(res.text).toBe(FIELD_VALUES.endpoint_1));
  });

  test('Async Middleware test', async () => {
    await supertest(router)
      .get('/endpoint_2')
      .expect((res) => expect(res.text).toBe(FIELD_VALUES.endpoint_2));
  });

  test('ClassConstructor middleware works', async () => {
    await supertest(router)
      .get('/endpoint_3')
      .expect((res) => expect(res.text).toBe(FIELD_VALUES.endpoint_3));
  });
});
