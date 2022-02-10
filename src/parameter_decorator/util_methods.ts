import { ExpressCoreRoutable } from '../classes';
import { extender } from '../util';
import {
  DynamicParameterExtractorFunction,
  ParameterExtractorStorage,
  StaticParameterExtractorFunction,
} from './parameter_exctractor_storage';

/**
 * Creates Static Parameter Extractor for methods
 * Eg.: @Response
 */
export const CreateStaticParameterExtractor = <T = unknown>(
  extractor_name: string,
  method: StaticParameterExtractorFunction<T>,
) => {
  ParameterExtractorStorage.register_static_parameter_extractor(extractor_name, method);

  return (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
    parameterExtractor(target, method_name, parameter_index, extractor_name);
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

  return (argument: Args) =>
    (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
      parameterExtractor(
        target,
        method_name,
        parameter_index,
        extractor_name,
        argument as unknown as any[],
      );
    };
};

export const parameterExtractor = (
  target: ExpressCoreRoutable,
  method_name: string,
  parameter_index: number,
  extractor_name: string,
  argument?: any[],
) => {
  extender.setProperty<ExpressCoreRoutable>(target.constructor.name, (newInstance) =>
    newInstance.addParameterExtractor(method_name, parameter_index, extractor_name, argument),
  );
};
