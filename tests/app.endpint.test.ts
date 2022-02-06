import { expect } from 'chai';
import { test_app_instance } from './test_app';
const supertest = require('supertest');

describe('Application with endpoints', () => {
  const app = test_app_instance.getInitializedRoutable();

  it('TestApp Path: /', async () => {
    await supertest(app)
      .get('/')
      .expect((res: any) => {
        expect(res.text).equal('Nice');
      });
  });

  it('TestApp Path: /13', async () => {
    await supertest(app)
      .get('/13')
      .expect((res: any) => {
        expect(res.statusCode).equal(404);
      });
  });

  it('TestApp Path: /router', async () => {
    await supertest(app)
      .get('/router')
      .expect((res: any) => {
        expect(res.body).deep.equal({ data: 'Index' });
      });
  });

  it('TestApp Path: /router/13', async () => {
    await supertest(app)
      .get('/router/13')
      .expect((res: any) => {
        expect(res.body).deep.equal({ data: 13 });
      });
  });
});
