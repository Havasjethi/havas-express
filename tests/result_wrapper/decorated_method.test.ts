import { App, Get, Host, Path, PathVariable, ResultWrapper } from '../../index';
import { ResultWrapperParameters } from '../../src/classes/express_core_routable';
import { get_request_creator } from '../util';

@Path("/")
class AAA extends App {


  @ResultWrapper
  method_handler ({ result, response }: ResultWrapperParameters) {
    response.send(result);
  }

  @Get('/endpoint_:num')
  response (@PathVariable('num') num: string) {
    return num;
  }

  @Get('/async_endpoint_:num')
  async asnyc_response (@PathVariable('num') num: string) {
    return num;
  }
}


describe('Method Wrapper', () => {
  const app = new AAA();
  const get_creator = get_request_creator(app);

  test('endpoint_1', async () => {
    await get_creator('/endpoint_111')
      .expect(res => expect(res.text).toBe('111'));
  });

  test('endpoint_2', async () => {
    await get_creator('/endpoint_222')
      .expect(res => expect(res.text).toBe('222'));
  });

  test('async endpoint_1', async () => {
    await get_creator('/async_endpoint_111')
      .expect(res => expect(res.text).toBe('111'));
  });

  test('async  endpoint_2', async () => {
    await get_creator('/async_endpoint_222')
      .expect(res => expect(res.text).toBe('222'));
  });
});
