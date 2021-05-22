import { App, Host } from "../index";

describe('Application test', () => {
  const port = 4000;
  const host = 'localhost';
  const auto_start = false;

  @Host({
    port_number: port,
    host: host,
    auto_start: auto_start,
  })
  class EmptyTestApp extends App {}

  const test_app = new EmptyTestApp();

  test('Port setting is correct', () => {
    expect(test_app.port).toEqual(port);
  });

  test('Host setting is correct', () => {
    expect(test_app.host).toEqual(host);
  });

  test('Path is the default', () => {
    expect(test_app.path).toEqual('/');
  });
});


