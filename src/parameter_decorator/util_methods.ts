import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { extender } from '../util/class_decorator_util';
import {
  DynamicParameterExctractorFunction,
  ParameterExtractorStorage,
  StaticParameterExctractorFunction,
} from './parameter_exctractor_storage';

export const StaticMethodParameterExtractor = <T = unknown>(
  extractor_name: string,
  method: StaticParameterExctractorFunction<T>,
) => {
  ParameterExtractorStorage.register_static_parameter_extractor(extractor_name, method);

  return (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
    parameterExtractor(target, method_name, parameter_index, extractor_name);
  };
};

export const DynamicParameterExtractor = <Args = unknown, Result = unknown>(
  extractor_name: string,
  method: DynamicParameterExctractorFunction<Result, Args>,
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
