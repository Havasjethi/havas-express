import { Routable } from "../classes/routable";
import { PostProcessorType } from "../interfaces/method_entry";
import { extender } from "../util/class_decorator_util";


const request_postprocessor = (
  target: Routable,
  method_name: string,
  parameter_index: number,
  post_processor: PostProcessorType,
) => {
  extender.set_property<Routable>(
    target.constructor.name,
    (x) => x.add_request_postprocessor(method_name, parameter_index, post_processor),
  );
};

export const PostProcessor = <Input = any, Output = any> (process_function: PostProcessorType<Input, Output>) => {
  return (target: Routable, method_name: string, parameter_index: number) => {
    request_postprocessor(target, method_name, parameter_index, process_function);
  };
};
