import {
  App,
  Get,
  Host,
  Path,
  PathVariable,
  Res,
  Response,
  Result,
  ResultWrapper,
  Router,
} from '../../index';
import { ResultWrapperFunctionParameters } from '../../src/types';
import { get_request_creator } from '../util';

@Path('/')
class AAA extends App {
  public setPath(path: string): this {
    this.path = path;
    return this;
  }

  @ResultWrapper
  method_handler({ result, response }: ResultWrapperFunctionParameters) {
    response.send(result);
  }

  @Get('/endpoint_:num')
  response(@PathVariable('num') num: string) {
    return num;
  }

  @Get('/async_endpoint_:num')
  async async_response(@PathVariable('num') num: string) {
    return num;
  }
}

describe('Method Wrapper', () => {
  const app = new AAA();
  const get_creator = get_request_creator(app);

  test('endpoint_1', async () => {
    await get_creator('/endpoint_111').expect((res) => expect(res.text).toBe('111'));
  });

  test('endpoint_2', async () => {
    await get_creator('/endpoint_222').expect((res) => expect(res.text).toBe('222'));
  });

  test('async endpoint_1', async () => {
    await get_creator('/async_endpoint_111').expect((res) => expect(res.text).toBe('111'));
  });

  test('async  endpoint_2', async () => {
    await get_creator('/async_endpoint_222').expect((res) => expect(res.text).toBe('222'));
  });
});
