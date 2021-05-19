import { App, Get, Host } from "../index";
import { test_app_instance } from "./test_app";
const supertest = require("supertest");

describe('Application with endpoints', () => {

  test('TestApp Path: /', async () => {
    await supertest(test_app_instance.get_initialized_routable())
      .get('/')
      .expect((res: any) => {
        expect(res.text).toBe('Nice');
      });
  });
  test('TestApp Path: /13', async () => {
    await supertest(test_app_instance.get_initialized_routable())
      .get('/13')
      .expect((res: any) => {
        expect(res.body.any).toBe(13);
      });
  });

  test('TestApp Path: /router/', async () => {
    await supertest(test_app_instance.get_initialized_routable())
      .get('/router/')
      .expect((res: any) => {
        expect(res.body).toEqual({data: 'Index'});
      });
  });

  test('TestApp Path: /router/13', async () => {
    await supertest(test_app_instance.get_initialized_routable())
      .get('/router/13')
      .expect((res: any) => {
        expect(res.body).toEqual({data: 13})
      });
  });
});
