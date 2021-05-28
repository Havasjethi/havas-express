import {Routable} from "../classes/routable";
import { extender } from "../util/class_decorator_util";
import { MethodParameterType } from "../interfaces/method_entry";

type TargetType = Routable;

const request_preprocessor = (
  target: TargetType,
  method_name: string,
  corresponding_type: MethodParameterType,
  parameter_index: number,
  data: any = undefined
) => {
  extender.set_property<TargetType>(
    target.constructor.name,
    (x) => x.add_request_preporecssor(method_name, corresponding_type, parameter_index, data)
  )
};

export const RequestObj = (target: TargetType, method_name: string, parameter_index: number) => {
  request_preprocessor(target, method_name, 'request', parameter_index);
};

export const ResponseObj = (target: TargetType, method_name: string, parameter_index: number) => {
  request_preprocessor(target, method_name, 'response', parameter_index);
};

export const Next = (target: TargetType, method_name: string, parameter_index: number) => {
  request_preprocessor(target, method_name, 'next', parameter_index);
}

//
// TODO :: Derefer name by method_name & position (index) position
//         Only found solution: stackoverflow.com/questions/1007981
//

export const Cookie = (name: string) => {
  return (target: TargetType, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'cookie', parameter_index, {
      variable_path: name
    });
  }
}

export const Body = (name: string) => {
  return (target: TargetType, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'body', parameter_index, {
      variable_path: name
    });
  }
}

export const PathVariable = (name: string) => {
  return (target: TargetType, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'path', parameter_index, {
      variable_path: name
    });
  }
};

export const Param = (name: string) => {
    return (target: TargetType, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'parameter', parameter_index, {
      variable_path: name
    });
  }
};

export const Query = (name: string) => {
    return (target: TargetType, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'query', parameter_index, {
      variable_path: name
    });
  }
};
