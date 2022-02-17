import { CoreEndpoint } from 'havas-core';
import { PostProcessorType } from '../../interfaces/method_entry';
import { UniversalPostProcessor } from '../post_processor_types';
import { Middleware } from './middleware';

export interface ExpressEndpoint extends CoreEndpoint<UniversalPostProcessor> {
  middlewares: Middleware[];
}
