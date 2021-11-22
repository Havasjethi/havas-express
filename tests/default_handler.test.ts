import { App, Router, DefaultHandler, Path } from '../index';
import { get_request_creator, init_app } from './util';

const default_text_app = '--default_text_app--';
const default_text_router = '--default_text_router--';

@Path('/')
class TestApp extends App {
  @DefaultHandler
  default(req: any, res: any, next: any) {
    res.send(default_text_app);
  }
}

@Path('/router')
class TestRouter extends Router {
  @DefaultHandler
  default(req: any, res: any, next: any) {
    res.send(default_text_router);
  }
}

describe('DefaultHandler tests', () => {
  const app = init_app(new TestApp()
    .append(new TestRouter())
    );
  const get_ = app.then((application) => get_request_creator(application));

  test('TestApp - /', async () => {
    await get_.then((e) => e('/').expect((res) => expect(res.text).toBe(default_text_app)));
  });

  test('TestApp - /asd', async () => {
    await get_.then((e) => e('/asd').expect((res) => expect(res.text).toBe(default_text_app)));
  });

  test('TestRouter - /router/asd', async () => {
    await get_.then((e) =>
      e('/router/asd').expect((res) => expect(res.text).toBe(default_text_router)),
    );
  });

  test('TestRouter - /router', async () => {
    await get_.then((e) =>
      e('/router').expect((res) => expect(res.text).toBe(default_text_router)),
    );
  });
});
