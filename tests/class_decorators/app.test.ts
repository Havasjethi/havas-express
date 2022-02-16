import { App, Host } from '../../index';

describe('Application test', () => {
  const port = 4000;
  const host = 'localhost';
  const auto_start = false;

  @Host({
    port,
    host: host,
    auto_start: auto_start,
  })
  class EmptyTestApp extends App {}

  const test_app = new EmptyTestApp();

  test('Port setting is correct', () => {
    expect(test_app.options.port).toEqual(port);
  });

  test('Host setting is correct', () => {
    expect(test_app.options.host).toEqual(host);
  });

  test('Path is the default', () => {
    expect(test_app.path).toEqual('/');
  });
});
