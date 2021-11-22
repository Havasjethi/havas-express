import { ExpressCoreRoutable } from '../classes/express_core_routable';
import { PostProcessorType } from '../interfaces/method_entry';
import { extender } from '../util/class_decorator_util';

const requestPostprocessor = (
  target: ExpressCoreRoutable,
  method_name: string,
  parameter_index: number,
  post_processor: PostProcessorType<any, any>,
) => {
  extender.set_property<ExpressCoreRoutable>(target.constructor.name, (x) =>
    x.addRequestPostprocessor(method_name, parameter_index, post_processor),
  );
};

export const PostProcessor = <Input = any, Output = any>(
  process_function: PostProcessorType<Input, Output>,
) => {
  return (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
    requestPostprocessor(target, method_name, parameter_index, process_function);
  };
};
