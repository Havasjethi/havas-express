import request from 'supertest';
import {
  App,
  createPostProcessor,
  createPostProcessorFactory,
  Get,
  Host,
  PathVariable,
  ResponseObj,
  ResultWrapper,
} from '../../../index';
import { UniversalPostProcessor } from '../../../src/types/post_processor_types';

const Convert = createPostProcessorFactory<NumberConstructor | StringConstructor>(
  (x: string, type) => {
    return type === Number ? parseInt(x) : x;
  },
);

@Host({ port: 33123 })
@ResultWrapper(({ response, result }) => response.set('Content-Type', 'text/plain').send(result))
class TestApp extends App {
  @Get('/number-:id')
  square(
    @PathVariable('id', (x: string | number) => `${(+x) ** 2}`)
    doubled_id: number,
  ) {
    return doubled_id;
  }

  @Get('/string-:str')
  string_manipulation(
    @PathVariable('str', (str: string) => str + '__')
    doubled_id: number,
  ) {
    return doubled_id;
  }

  @Get('/void-:str')
  void_manipulation(
    @PathVariable('str', (x: string) => '13')
    parameter: any,
  ) {
    return parameter;
  }

  @Get('/async-void-:str')
  async_void_manipulation(
    @PathVariable('str', async (x: string) => '13')
    parameter: any,
  ) {
    return parameter;
  }

  @Get('/as-string-:str')
  asString(@PathVariable('str', Convert(String)) variable: any) {
    return variable + 1;
  }

  @Get('/as-number-:num')
  asNumber(@PathVariable('num', Convert(Number)) variable: any) {
    return `${variable + 1}`;
  }
}

describe('PostProcessor tests', () => {
  const test_app = new TestApp().getInitializedRoutable();
  const get_ = (path: string): request.Test => request(test_app).get(path);

  test('test - square', async () => {
    const input = 13;
    await get_('/number-' + input).expect((response) => expect(response.text).toBe('169'));
  });

  test('test - string_manipulation', async () => {
    const input = '13';
    await get_('/string-' + input).expect((response) => expect(response.text).toBe('13__'));
  });

  test('test - void_manipulation', async () => {
    const input = '13';
    await get_('/void-' + input).expect((response) => expect(response.text).toBe('13'));
  });

  test('test - void_manipulation 2', async () => {
    const input = '13';
    await get_('/async-void-' + input).expect((response) => expect(response.text).toBe('13'));
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
