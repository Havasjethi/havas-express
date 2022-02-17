import { postProcessorStorage } from '../classes/post_processor_storage';
import {
  DynamicProcessorFunction,
  ProcessorFactoryToken,
  ProcessorFunction,
  ProcessorToken,
} from '../types';

export function createPostProcessor(processorFunction: ProcessorFunction): ProcessorToken {
  return {
    token: postProcessorStorage.registerPostProcessor(processorFunction),
  };
}

export function createPostProcessorFactory<FactoryArgs = unknown>(
  processorFactoryFunction: DynamicProcessorFunction<FactoryArgs>,
): (args: FactoryArgs) => ProcessorFactoryToken {
  const token = postProcessorStorage.registerPostProcessorFactory(processorFactoryFunction);

  return (args: FactoryArgs) => {
    return { token, args };
  };
}
