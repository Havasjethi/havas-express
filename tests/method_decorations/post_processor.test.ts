import { App, Get, Host, PathVariable, PostProcessor, ResultWrapper } from '../../index';
import request from 'supertest';

@Host({ port: 33123 })
@ResultWrapper(({ response, result }) => response.set('Content-Type', 'text/plain').send(result))
class TestApp extends App {
  // Todo :: Should this be supported ??
  // @Get('/get_number')
  // return_13 (
  //   @PostProcessor(() => '13')
  //   x: string
  // ) {
  //   return x;
  // }

  @Get('/number-:id')
  square(
    @PostProcessor((x: string | number) => `${(+x) ** 2}`)
    @PathVariable('id')
    doubled_id: number,
  ) {
    return doubled_id;
  }

  @Get('/string-:str')
  string_manipultaion(
    @PostProcessor((str: string) => str + '__')
    @PathVariable('str')
    doubled_id: number,
  ) {
    return doubled_id;
  }

  @Get('/void-:str')
  void_manipultaion(
    @PostProcessor((x: string) => {
      const y = x + 13;
    })
    @PathVariable('str')
    parameter: any,
  ) {
    return parameter;
  }
}

describe('PostProcessor tests', () => {
  const test_app = new TestApp().get_initialized_routable();
  const get_ = (path: string): request.Test => request(test_app).get(path);

  // test('test - return_13', async () => {
  //   await get_('/get_number')
  //     .expect((response) => expect(response.text).toBe('13'));
  // });

  test('test - square', async () => {
    const input = 13;
    await get_('/number-' + input).expect((response) => expect(response.text).toBe('169'));
  });

  test('test - string_manipultaion', async () => {
    const input = '13';
    await get_('/string-' + input).expect((response) => expect(response.text).toBe('13__'));
  });

  test('test - void_manipultaion', async () => {
    const input = '13';
    await get_('/void-' + input).expect((response) => expect(response.text).toBe('13'));
  });
});
