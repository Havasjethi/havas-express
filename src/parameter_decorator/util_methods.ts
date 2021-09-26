import { Routable } from '../classes/express_core_routable';
import { extender } from '../util/class_decorator_util';
import { ParameterExctractor, ParameterExtractorStorage } from './parameter_exctractor_storage';


export const MethodParameterExtractor = <T = unknown>(
  extractor_name: string,
  method: ParameterExctractor<T>,
  argument: any = undefined,
) => {
  ParameterExtractorStorage.register_parameter_extractor(extractor_name, method);

  return (target: Routable, method_name: string, parameter_index: number) => {
    parameter_extractor(
      target,
      method_name,
      parameter_index,
      extractor_name,
      argument,
    );
  };
}

export const parameter_extractor = (
  target: Routable,
  method_name: string,
  parameter_index: number,
  extractor_name: string,
  argument: any[]
) => {
  extender.set_property<Routable>(
    target.constructor.name,
    (x) => x.add_parameter_extractor(
      method_name,
      parameter_index,
      extractor_name,
      argument,
    )
  );
};
