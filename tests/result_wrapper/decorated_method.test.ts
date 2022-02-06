import { expect } from 'chai';
import { App, Get, Host, Path, PathVariable, ResultWrapper } from '../../index';
import { ResultWrapperFunctionParameters } from '../../src/classes/types/result_wrapper';
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
  async asnyc_response(@PathVariable('num') num: string) {
    return num;
  }
}

describe('Method Wrapper', () => {
  const app = new AAA();
  const get_creator = get_request_creator(app);

  it('endpoint_1', async () => {
    await get_creator('/endpoint_111').expect((res) => expect(res.text).equal('111'));
  });

  it('endpoint_2', async () => {
    await get_creator('/endpoint_222').expect((res) => expect(res.text).equal('222'));
  });

  it('async endpoint_1', async () => {
    await get_creator('/async_endpoint_111').expect((res) => expect(res.text).equal('111'));
  });

  it('async  endpoint_2', async () => {
    await get_creator('/async_endpoint_222').expect((res) => expect(res.text).equal('222'));
  });
});
