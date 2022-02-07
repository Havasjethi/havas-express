import { IRouter } from 'express';
import { AsyncContainerModule, interfaces as inversifyInterfaces } from 'inversify';
import supertest from 'supertest';
import { initializeControllers } from '../../index';
import { DummyService } from './folder_importing/sub_ctrl_folder/service';

const SERVICE_STATUS_CODE = 205;

describe('Folder DI import', () => {
  let router: IRouter;

  beforeAll(async () => {
    let asyncModule = new AsyncContainerModule(async (bind: inversifyInterfaces.Bind) => {
      bind<DummyService>(DummyService).toConstantValue(new DummyService(SERVICE_STATUS_CODE));
    });

    const result = await initializeControllers(
      { kind: 'folder', folder: `${ __dirname }/folder_importing` },
      { asyncModule },
    );

    expect(result).not.toHaveLength(0);
    router = result[0].getInitializedRoutable();
  });


  it('Main Controller Works', (done) => {
    supertest(router).get('/').expect(200, done);
  });

  it('Sub Controller found', (done) => {
    supertest(router).get('/sub-endpoint').expect(200, done);
  });

  it('Sub Controller found', (done) => {
    supertest(router).get('/sub-endpoint-service').expect(SERVICE_STATUS_CODE, done);
  });
});
