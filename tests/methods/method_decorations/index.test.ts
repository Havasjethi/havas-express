import { __testAppWithMethodDecorators } from "./testapp_with_method_decorators";
import supertest from "supertest";

describe('testAppWithMethodDecorators', () => {


  test('Index GET call', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .get('/a').expect(e => expect(e.text).toBe('index'));
  });

  test('Index POST call', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a').expect(e => expect(e.text).toBe('post_index'));
  });

  test('Index DELETE call', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .delete('/a').expect(e => expect(e.text).toBe('delete_index'));
  });

  test('@BODY check', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a/user')
      .send({user: {name: 'Laci', sex: 'Male'}})
      .expect((response) => {
        expect(response.text).toBe('Laci')
      })
  });

  test('@QUERY check', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a/param_extract?p1=13')
      .expect((response) => {
        expect(response.text).toBe('13')
      })
  });

  test('@COOKIE check ', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a/cookie_extract')
      .set('Cookie', ['user_name=Peti'])
      .expect((response) => {
        expect(response.text).toBe('Peti')
      })
  });

  test('@PathVariable, @Param extract_from_path check ', async () => {
    await supertest(__testAppWithMethodDecorators.get_initialized_routable())
      .post('/a/some/abcde')
      .expect((response) => {
        expect(response.body).toEqual({path: 'abcde', param: 'abcde'});
      });
  });
});
