import { Routable } from "../classes/routable";
import { extender } from "../util/class_decorator_util";
import { MethodParameterType, PostProcessorType } from "../interfaces/method_entry";

const request_preprocessor = (
  target: Routable,
  method_name: string,
  corresponding_type: MethodParameterType,
  parameter_index: number,
  data: any = undefined
) => {
  extender.set_property<Routable>(
    target.constructor.name,
    (x) => x.add_request_preporecssor(method_name, corresponding_type, parameter_index, data)
  );
};

const request_postprocessor = (
  target: Routable,
  method_name: string,
  parameter_index: number,
  post_processor: PostProcessorType,
) => {
  extender.set_property<Routable>(
    target.constructor.name,
    (x) => x.add_request_postprocessor(method_name, parameter_index, post_processor)
  );
};

export const RequestObj = (target: Routable, method_name: string, parameter_index: number) => {
  request_preprocessor(target, method_name, 'request', parameter_index);
};

export const ResponseObj = (target: Routable, method_name: string, parameter_index: number) => {
  request_preprocessor(target, method_name, 'response', parameter_index);
};

export const Next = (target: Routable, method_name: string, parameter_index: number) => {
  request_preprocessor(target, method_name, 'next', parameter_index);
}

//
// TODO :: Derefer name by method_name & position (index) position
//         Only found solution: stackoverflow.com/questions/1007981
//

export const Cookie = (name: string) => {
  return (target: Routable, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'cookie', parameter_index, {
      variable_path: name
    });
  }
}

export const Body = (name: string) => {
  return (target: Routable, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'body', parameter_index, {
      variable_path: name
    });
  }
}

export const PathVariable = (name: string) => {
  return (target: Routable, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'path', parameter_index, {
      variable_path: name
    });
  }
};

export const Param = (name: string) => {
  return (target: Routable, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'parameter', parameter_index, {
      variable_path: name
    });
  }
};

export const Query = (name: string) => {
  return (target: Routable, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'query', parameter_index, {
      variable_path: name
    });
  }
};

/**
 * if (`parameter_name` is undefined)
 *  - Then retuns the session object
 *  - Else get value from session cookie
 *
 * @param parameter_name
 * @constructor
 */
export const Session = (parameter_name: string | undefined = undefined) => {
  return (target: Routable, method_name: string, parameter_index: number) => {
    request_preprocessor(target, method_name, 'session', parameter_index, {
      variable_path: parameter_name
    });
  }
}

export const SessionId = (target: Routable, method_name: string, parameter_index: number) => {
  request_preprocessor(target, method_name, 'sessionId', parameter_index);
}

export const PostProcessor= <Input = any, Output = any> (process_function: PostProcessorType<Input, Output>) => {
  return (target: Routable, method_name: string, parameter_index: number) => {
    request_postprocessor(target, method_name, parameter_index, process_function);
  };
};
