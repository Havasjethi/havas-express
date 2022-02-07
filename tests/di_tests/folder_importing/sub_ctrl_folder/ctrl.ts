import { Controller, ExpressRequest, ExpressResponse, Get, Path, Router } from '../../../../index';
import { DummyService } from './service';


@Controller()
export class SubController extends Router {

  constructor (
    private service: DummyService,
  ) {super();}

  @Get('/sub-endpoint')
  index (req: ExpressRequest, res: ExpressResponse) {
    res.sendStatus(200);
  }

  @Get('/sub-endpoint-service')
  serviceDependent (req: ExpressRequest, res: ExpressResponse) {
    res.sendStatus(this.service.getStatusCode())
  }
}
