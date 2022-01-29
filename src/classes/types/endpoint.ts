import { CoreEndpoint } from 'havas-core';
import { Middleware } from './middleware';

export interface ExpressEndpoint extends CoreEndpoint {
  middlewares: Middleware[];
}
