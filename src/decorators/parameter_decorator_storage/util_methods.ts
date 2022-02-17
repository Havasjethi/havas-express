import { ExpressCoreRoutable } from '../../classes';
import {
  DynamicParameterExtractorFunction,
  StaticParameterExtractorFunction,
} from '../../types/parameter_extractor_types';
import { UniversalPostProcessor } from '../../types/post_processor_types';
import { extender } from '../../util';
import { ParameterExtractorStorage } from './parameter_exctractor_storage';

export const parameterExtractor = (
  target: ExpressCoreRoutable,
  method_name: string,
  parameter_index: number,
  extractor_name: string,
  post_processors?: UniversalPostProcessor[],
  argument?: any[],
) => {
  extender.setProperty<ExpressCoreRoutable>(target.constructor.name, (newInstance) =>
    newInstance.addParameterExtractor(
      method_name,
      parameter_index,
      extractor_name,
      argument,
      post_processors,
    ),
  );
};

/**
 * Creates Static Parameter Extractor for methods
 * Eg.: @Response
 */
export const CreateStaticParameterExtractor = <T = unknown>(
  extractor_name: string,
  method: StaticParameterExtractorFunction<T>,
) => {
  ParameterExtractorStorage.register_static_parameter_extractor(extractor_name, method);

  return (...post_processors: UniversalPostProcessor[]) =>
    (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
      parameterExtractor(target, method_name, parameter_index, extractor_name, post_processors);
    };
};

/**
 * Creates Dynamic Parameter Extractor for endpoint methods
 * Eg.: @Body(<path>), @PathVariable(<name>)
 */
export const CreateDynamicParameterExtractor = <Args = unknown, Result = unknown>(
  extractor_name: string,
  method: DynamicParameterExtractorFunction<Result, Args>,
) => {
  ParameterExtractorStorage.register_dynamic_parameter_extractor(extractor_name, method);

  return (argument: Args, ...post_processors: UniversalPostProcessor[]) =>
    (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
      parameterExtractor(
        target,
        method_name,
        parameter_index,
        extractor_name,
        post_processors,
        argument as unknown as any[],
      );
    };
};
