import { test_app_instance } from '../test_app';
const supertest = require('supertest');

describe('Application with endpoints', () => {
  const app = test_app_instance.getInitializedRoutable();

  test('TestApp Path: /', async () => {
    await supertest(app)
      .get('/')
      .expect((res: any) => {
        expect(res.text).toBe('Nice');
      });
  });

  test('TestApp Path: /13', async () => {
    await supertest(app)
      .get('/13')
      .expect((res: any) => {
        expect(res.statusCode).toBe(404);
      });
  });

  test('TestApp Path: /router', async () => {
    await supertest(app)
      .get('/router')
      .expect((res: any) => {
        expect(res.body).toEqual({ data: 'Index' });
      });
  });

  test('TestApp Path: /router/13', async () => {
    await supertest(app)
      .get('/router/13')
      .expect((res: any) => {
        expect(res.body).toEqual({ data: 13 });
      });
  });
});
