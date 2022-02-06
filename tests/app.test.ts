import { expect } from 'chai';
import { App, Host } from '../index';

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

  it('Port setting is correct', () => {
    expect(test_app.options.port).equal(port);
  });

  it('Host setting is correct', () => {
    expect(test_app.options.host).equal(host);
  });

  it('Path is the default', () => {
    expect(test_app.path).equal('/');
  });
});
