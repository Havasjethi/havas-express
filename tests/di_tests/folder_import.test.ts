import { IRouter } from 'express';
import supertest from 'supertest';
import { ExpressCoreRoutable, initializeControllerTree } from '../../index';

describe('Folder DI import', () => {
  const classes: ExpressCoreRoutable[] = [];
  let router: IRouter;

  beforeAll(async () => {
    const result = await initializeControllerTree(
      { kind: 'folder', folder: `${__dirname}/folder_importing` },
      true,
    );

    classes.push(...result);
    expect(classes).not.toHaveLength(0);
    router = classes[0].getInitializedRoutable();
  });


  it('Main Controller Works', (done) => {
    supertest(router).get('/').expect(200, done);
  });

  it('Sub Controller found', (done) => {
    supertest(router).get('/sub-endpoint/').expect(200, done);
  });
});
