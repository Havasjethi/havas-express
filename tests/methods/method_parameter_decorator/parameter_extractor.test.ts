import {
  App,
  Body,
  Cookie,
  CreateDynamicParameterExtractor,
  ExpressNext,
  ExpressRequest,
  ExpressResponse,
  Get,
  Host,
  PathVariable,
  Post,
  Query,
  RequestObj,
  ResponseObj,
  ResultWrapper,
  CreateStaticParameterExtractor,
  UseMiddleware,
  WholeBody,
  WholeQuery,
} from '../../../index';
import request from 'supertest';
import bodyParser from 'body-parser';
// @ts-ignore
import cookieParser from 'cookie-parser';
import { Next } from '../../../src/decorators/parameter_decorator_storage';

const Paths = {
  BodyMethod: '/body',
  CookieSetMethod: '/cookie-set',
  CookieMethod: '/cookie',
  PathVariable: '/path-:id-:name',
  WholeQuery: '/whole',
  Query: '/query',
  Session: '/session',
  Raw: '/raw',
  RawDecorated: '/raw-decorate',
  CustomStatic: '/custom-1',
  CustomDynamic: '/custom-2',
};

const Methods = {
  BodyMethod: (body: any, part: any) => ({
    whole: body,
    part: part,
  }),
};

function StaticFunctionBased() {
  return CreateStaticParameterExtractor('C1', () => 'C1');
}

const StaticConstantBased = CreateStaticParameterExtractor('C2', () => 'C2');

const Dyn = CreateDynamicParameterExtractor<string>('Dyn', (arg) => arg);

const DynStatic = (x: string) => CreateStaticParameterExtractor(`dyn-${x}`, () => x);

@Host({})
@UseMiddleware(bodyParser.json())
@UseMiddleware(cookieParser())
@ResultWrapper(({ response, result }) => response.set('Content-Type', 'text/plain').send(result))
class TestApp extends App {
  @Get(Paths.Raw)
  testBase(req: ExpressRequest, res: ExpressResponse, next: ExpressNext) {
    return {
      req: req.constructor.name,
      res: res.constructor.name,
      next: next.constructor.name,
    };
  }

  @Get(Paths.RawDecorated)
  testDecorated(
    @RequestObj req: ExpressRequest,
    @ResponseObj res: ExpressResponse,
    @Next next: ExpressNext,
  ) {
    return {
      req: req.constructor.name,
      res: res.constructor.name,
      next: next.constructor.name,
    };
  }

  @Post(Paths.BodyMethod)
  body(@WholeBody body: any, @Body('part') part: any) {
    return Methods.BodyMethod(body, part);
  }

  @Get(Paths.CookieSetMethod)
  setCookie(@ResponseObj res: ExpressResponse) {
    res.cookie('cookie', 'hey');
    res.send();
  }

  @Get(Paths.CookieMethod)
  getCookie(@Cookie('cookie') storedCookie: any) {
    return storedCookie;
  }

  @Get(Paths.PathVariable)
  testPathVariables(@PathVariable('id') id: string, @PathVariable('name') name: string) {
    return { id, name };
  }

  @Get(Paths.Query)
  testQuery(@WholeQuery query: any, @Query('name') name: any, @RequestObj req: any) {
    return { query, name };
  }

  @Get(Paths.CustomStatic)
  custom1(@StaticFunctionBased() x: any, @StaticConstantBased y: any) {
    return { x, y };
  }

  @Get(Paths.CustomStatic)
  custom2(@Dyn('C1') x: any, @DynStatic('C2') y: any) {
    return { x, y };
  }
}

describe('Parameter Extractor tests', () => {
  const test_app = new TestApp().getInitializedRoutable();

  const expressPlainTypes = JSON.stringify({
    req: 'IncomingMessage',
    res: 'ServerResponse',
    next: 'Function',
  });

  describe('Built in', () => {
    test('Raw', async () => {
      await request(test_app)
        .get(Paths.Raw)
        .expect((req) => expect(req.text).toBe(expressPlainTypes));
    });

    test('Raw decorators', async () => {
      await request(test_app)
        .get(Paths.RawDecorated)
        .expect((req) => expect(req.text).toBe(expressPlainTypes));
    });

    test('Check Body', async () => {
      const data = { part: 13 };
      const expected = JSON.stringify(Methods.BodyMethod(data, data['part']));

      await request(test_app)
        .post(Paths.BodyMethod)
        .send(data)
        .expect((res) => expect(res.text).toBe(expected));
    });

    describe('Coockie', () => {
      const agent = request.agent(test_app);

      test('Should save cookie', async () => {
        await agent.get(Paths.CookieSetMethod).expect('set-cookie', 'cookie=hey; Path=/');
      });

      test('should save cookies', async () => {
        await agent.get(Paths.CookieMethod).expect(({ text }) => expect(text).toBe('hey'));
      });
    });

    test('PathVariable', async () => {
      const obj = {
        id: '123',
        name: 'asdsa',
      };
      const path = Paths.PathVariable.replace(':id', obj.id).replace(':name', obj.name);
      await request(test_app)
        .get(path)
        .expect(({ text }) => expect(text).toBe(JSON.stringify(obj)));
    });

    test('testQuery', async () => {
      const query = '?x=13&name=Jhon';
      await request(test_app)
        .get(Paths.Query + query)
        .expect(({ text }) =>
          expect(text).toBe(JSON.stringify({ query: { x: '13', name: 'Jhon' }, name: 'Jhon' })),
        );
    });
  });

  describe('Custom', () => {
    test('Static typed', async () => {
      const expected = JSON.stringify({ x: 'C1', y: 'C2' });
      await request(test_app)
        .get(Paths.CustomStatic)
        .expect(({ text }) => expect(text).toBe(expected));
    });

    test('Dynamic typed', async () => {
      const expected = JSON.stringify({ x: 'C1', y: 'C2' });

      await request(test_app)
        .get(Paths.CustomStatic)
        .expect(({ text }) => expect(text).toBe(expected));
    });
  });
});
