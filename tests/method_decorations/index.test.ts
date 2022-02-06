import { expect } from 'chai';
import { __testAppWithMethodDecorators } from './testapp_with_method_decorators';
import supertest from 'supertest';

describe('testAppWithMethodDecorators', () => {
  it('Index GET call', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .get('/a')
      .expect((e) => expect(e.text).equal('index'));
  });

  it('Index POST call', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a')
      .expect((e) => expect(e.text).equal('post_index'));
  });

  it('Index DELETE call', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .delete('/a')
      .expect((e) => expect(e.text).equal('delete_index'));
  });

  it('@BODY check', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a/user')
      .send({ user: { name: 'Laci', sex: 'Male' } })
      .expect((response) => {
        expect(response.text).equal('Laci');
      });
  });

  it('@QUERY check', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a/param_extract?p1=13')
      .expect((response) => {
        expect(response.text).equal('13');
      });
  });

  it('@COOKIE check ', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a/cookie_extract')
      .set('Cookie', ['user_name=Peti'])
      .expect((response) => {
        expect(response.text).equal('Peti');
      });
  });

  it('@PathVariable, @Param extract_from_path check ', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a/some/abcde')
      .expect((response) => {
        expect(response.body).equal({ path: 'abcde', param: 'abcde' });
      });
  });
});
