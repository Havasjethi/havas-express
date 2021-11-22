import { CoreEndpoint } from 'havas-core';
import { Middleware } from './middleware';

export interface ExpressEndpoint extends CoreEndpoint {
  // TODO :: Remove name :: Mis spelled
  // name: string;
  middlewares: Middleware[];
}
