import {Routable} from "../classes/routable";

type TargetType = Routable<any>;

export const RequestObj = (target: TargetType, method_name: string, parameter_index: number) => {
  target.add_method_parameter(method_name, 'request', parameter_index);
};

export const ResponseObj = (target: TargetType, method_name: string, parameter_index: number) => {
  target.add_method_parameter(method_name, 'response', parameter_index);
};

export const Next = (target: TargetType, method_name: string, parameter_index: number) => {
  target.add_method_parameter(method_name, 'next', parameter_index);
}

//
// TODO :: Derefer name by method_name & position (index) position
//         Only found solution: stackoverflow.com/questions/1007981
//

export const Cookie = (name: string) => {
  return (target: TargetType, method_name: string, parameter_index: number) => {
    target.add_method_parameter(method_name, 'cookie', parameter_index, {
      variable_path: name
    });
  }
}

export const Body = (name: string) => {
  return (target: TargetType, method_name: string, parameter_index: number) => {
    target.add_method_parameter(method_name, 'body', parameter_index, {
      variable_path: name
    });
  }
}

export const PathVariable = (name: string) => {
  return (target: TargetType, method_name: string, parameter_index: number) => {
    target.add_method_parameter(method_name, 'path', parameter_index, {
      variable_path: name
    });
  }
};

export const Param = (name: string) => {
    return (target: TargetType, method_name: string, parameter_index: number) => {
    target.add_method_parameter(method_name, 'parameter', parameter_index, {
      variable_path: name
    });
  }
};

export const Query = (name: string) => {
    return (target: TargetType, method_name: string, parameter_index: number) => {
    target.add_method_parameter(method_name, 'query', parameter_index, {
      variable_path: name
    });
  }
};
