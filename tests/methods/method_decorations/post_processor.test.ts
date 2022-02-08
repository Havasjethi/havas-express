import request from 'supertest';
import {
  App,
  Get,
  Host,
  PathVariable,
  PostProcessor,
  ResponseObj,
  ResultWrapper,
} from '../../../index';

const Convert = (type: NumberConstructor | StringConstructor) =>
  PostProcessor((x: string) => {
    return type === Number ? parseInt(x) : x;
  });

@Host({ port: 33123 })
@ResultWrapper(({ response, result }) => response.set('Content-Type', 'text/plain').send(result))
class TestApp extends App {
  /*
    // Todo :: Should this be supported ??
    // By adding this feature it would be possible to wrap the Req, Res, Next function,
    // but it is useless since the objects are configurable by the Express config

    @Get('/get_number')
    return_13(
      @PostProcessor(() => '13')
      x: string,
    ) {
      return x;
    }
  */

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
    @PostProcessor((x: string) => {})
    @PathVariable('str')
    parameter: any,
  ) {
    return parameter;
  }

  @Get('/as-string-:str')
  asString(@Convert(String) @PathVariable('str') variable: any) {
    return variable + 1;
  }

  @Get('/as-number-:num')
  asNumber(@Convert(Number) @PathVariable('num') variable: any, @ResponseObj respone: any) {
    return `${variable + 1}`;
  }
}

describe('PostProcessor tests', () => {
  const test_app = new TestApp().getInitializedRoutable();
  const get_ = (path: string): request.Test => request(test_app).get(path);

  // test('test - return_13', async () => {
  //   await get_('/get_number').expect((response) => expect(response.text).toBe('13'));
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

  test('test - Str as string', async () => {
    const input = '13';
    const expected = input + 1;
    await get_('/as-string-' + input).expect((response) => expect(response.text).toBe(expected));
  });

  test('test - Str as Number', async () => {
    const input = '13';
    const expected = `${parseInt(input) + 1}`;
    await get_('/as-number-' + input).expect((response) => expect(response.text).toBe(expected));
  });
});
