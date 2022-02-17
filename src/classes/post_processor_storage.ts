// @ts-ignore
import uniqid from 'uniqid';
import {
  DynamicProcessorFunction,
  ProcessorFactoryToken,
  ProcessorFunction,
  ProcessorToken,
} from '../types/post_processor_types';

class PostProcessorStorage {
  postProcessors: Map<string, ProcessorFunction>;
  postProcessorsFactory: Map<string, DynamicProcessorFunction<any>>;

  constructor() {
    this.postProcessors = new Map<string, ProcessorFunction<any, any>>();
    this.postProcessorsFactory = new Map<string, DynamicProcessorFunction<any>>();
  }

  public getPostProcessor(id: string): ProcessorFunction<any, any> | undefined {
    return this.postProcessors.get(id);
  }

  public getPostProcessorDangerous(id: string): ProcessorFunction<any, any> {
    return this.postProcessors.get(id)!;
  }

  public getPostProcessorFactory(id: string): DynamicProcessorFunction<any> | undefined {
    return this.postProcessorsFactory.get(id);
  }

  public getPostProcessorFactoryDangerous(id: string): DynamicProcessorFunction<any> {
    return this.postProcessorsFactory.get(id)!;
  }

  public registerPostProcessor(postProcessor: ProcessorFunction<any, any>): string {
    const id: string = uniqid('PostProcessor-');
    this.postProcessors.set(id, postProcessor);

    return id;
  }

  public registerPostProcessorFactory(postProcessorFactory: DynamicProcessorFunction<any>): string {
    const id: string = uniqid('PostProcessorFactory-');
    this.postProcessorsFactory.set(id, postProcessorFactory);

    return id;
  }
}

export const postProcessorStorage = new PostProcessorStorage();
