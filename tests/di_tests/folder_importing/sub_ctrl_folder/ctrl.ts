import { Controller, ExpressRequest, ExpressResponse, Get, Path, Router } from '../../../../index';


@Controller()
@Path('/sub-endpoint')
export class SubController extends Router {

  @Get('/')
  index (req: ExpressRequest, res: ExpressResponse) {
    res.sendStatus(200);
  }
}
