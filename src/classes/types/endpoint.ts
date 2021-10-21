import { CoreEndpoint } from 'havas-core';
import { Middleware } from './middleware';

export type PostProcessor<Input = any, Outout = any> = (value: Input) => Outout;

export interface ExpressEndpoint extends CoreEndpoint {
  // TODO :: Remove name :: Mis spelled
  name: string;
  middlewares: Middleware[];
  postProcessors: {
    [parameterIndex: number]: PostProcessor[];
  };
  // httpMethod?: ExpressHttpMethod;
  // object_method_name?: string; // keyof <Current Object?>
  // object_method?: CallableFunction; // keyof <Current Object?>
  // path?: string;
  // middlewares: Middleware[];
  // use_wrapper?: boolean;
}
