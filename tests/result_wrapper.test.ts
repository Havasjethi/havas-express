import 'reflect-metadata';
import assert from 'assert';
import express from 'express';
import supertest from 'supertest';
import {
  App,
  Get,
  initializeControllers,
  MainController,
  Path,
  Response,
  ResultWrapper,
  Router,
  Controller,
  Result,
} from '../index';

import { Res } from '../src/decorators';

const MESSAGES = {
  MAIN_METHOD: 'MAIN_METHOD',
  RESULT_TEST: {
    INDEX: 'INDEX',
    EMPTY: '',
  },
  SUB_1_WRAPPER: 'SUB_1_METHOD',
  SUB_2_METHOD: 'SUB_2_METHOD',
  SUB_2_CHILD_METHOD: 'SUB_2_CHILD_METHOD',
  SUB_WITHOUT_CHILD_RW_FUNCTION: 'SUB_WITHOUT_CHILD_RW_FUNCTION',
  SUB_WITHOUT_CHILD_RW_METHOD: 'SUB_WITHOUT_CHILD_RW_METHOD',
};

@MainController
@ResultWrapper(({ result, response }) => {
  response.send(result);
})
class MainApp extends App {
  @Get('/main')
  method() {
    return MESSAGES.MAIN_METHOD;
  }
}

@Controller()
@Path('/result-test')
class ResultTestController extends Router {
  @ResultWrapper
  wrapper_method(@Res() response: Response, @Result() result: any) {
    response.send(result);
  }

  @Get('/index')
  index() {
    return MESSAGES.RESULT_TEST.INDEX;
  }

  @Get('/empty')
  empty() {
    return MESSAGES.RESULT_TEST.EMPTY;
  }
}

@Controller()
@Path('/sub-1')
class SubController_1 extends Router {
  @ResultWrapper
  wrapper_method(@Res() response: Response, @Result() res: any) {
    response.send(res);
  }

  @Get('')
  sub_method() {
    return MESSAGES.SUB_1_WRAPPER;
  }
}

@Controller(SubController_1)
@Path('/child')
class SubController_1_Child extends Router {
  @Get('/')
  sub_method() {
    return MESSAGES.SUB_WITHOUT_CHILD_RW_METHOD;
  }
}

@Controller()
@Path('/sub-2')
class SubController_2 extends Router {
  @ResultWrapper
  wrapper_method(@Res() response: Response) {
    response.send(MESSAGES.SUB_2_METHOD);
  }

  @Get('')
  empty_method() {}
}

@Controller(SubController_2)
@Path('/sub-sub')
class SubSubController extends Router {
  @ResultWrapper
  wrapper_method(@Res() response: Response) {
    response.send(MESSAGES.SUB_2_CHILD_METHOD);
  }

  @Get('')
  empty_method() {}
}

@Controller()
@Path('/sub-without')
class SubControllerWithoutWrapper extends Router {
  @Get('/')
  index(): string {
    return MESSAGES.SUB_WITHOUT_CHILD_RW_FUNCTION;
  }
}

describe('Result Wrapper Tests ', () => {
  let app: express.Application;

  beforeAll(async () => {
    const initialized_items = await initializeControllers({ kind: 'none' });

    assert(initialized_items.length != 0, 'Controllers initialization failed!');
    app = (initialized_items[0] as App).getInitializedRoutable();
  });

  describe('Method Level', () => {
    test('Default', async () => {
      await supertest(app)
        .get('/main')
        .expect((res) => expect(res.text).toBe(MESSAGES.MAIN_METHOD));
    });

    test('@Result works', async () => {
      const test_1 = supertest(app)
        .get('/result-test/index')
        .expect((res) => expect(res.text).toBe(MESSAGES.RESULT_TEST.INDEX));

      const test_2 = supertest(app)
        .get('/result-test/empty')
        .expect((res) => expect(res.text).toBe(MESSAGES.RESULT_TEST.EMPTY));

      await Promise.all([test_1, test_2]);
    });

    describe('Layering tests', () => {
      test('Test 1', async () => {
        await supertest(app)
          .get('/sub-1/')
          .expect((res) => expect(res.text).toBe(MESSAGES.SUB_1_WRAPPER));
      });

      test('Test 2', async () => {
        await supertest(app)
          .get('/sub-2/')
          .expect((res) => expect(res.text).toBe(MESSAGES.SUB_2_METHOD));
      });

      test('Test 3', async () => {
        await supertest(app)
          .get('/sub-2/sub-sub/')
          .expect((res) => expect(res.text).toBe(MESSAGES.SUB_2_CHILD_METHOD));
      });
    });

    test('Sub without result Wrapper', async () => {
      await supertest(app)
        .get('/sub-without/')
        .expect((e) => expect(e.text).toBe(MESSAGES.SUB_WITHOUT_CHILD_RW_FUNCTION));
    });

    test('Sub without result Wrapper', async () => {
      await supertest(app)
        .get('/sub-1/child/')
        .expect((e) => expect(e.text).toBe(MESSAGES.SUB_WITHOUT_CHILD_RW_METHOD));
    });
  });
});
