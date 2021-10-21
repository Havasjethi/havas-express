import { DynamicParameterExtractor, StaticMethodParameterExtractor } from './util_methods';

/*
  TODO :: Add StaticMethodParameterExtractor which return has no input parameters
   MethodParameterExtractor('Request', (_, req) => req)
   MethodParameterExtractor('Request', (_, req) => req)
   MethodParameterExtractor('Response', (_, __, res) => res)
   MethodParameterExtractor('Session', (_, req) => req.session);

   StaticMethodParameterExtractor('Request', (req) => req)
   StaticMethodParameterExtractor('Response', (_, res) => res)
   StaticMethodParameterExtractor('Next', (_, __, next) => next)
   StaticMethodParameterExtractor('Session', (req) => req.session);
 */

export const RequestObj = StaticMethodParameterExtractor('Request', (req) => req);

export const ResponseObj = StaticMethodParameterExtractor('Response', (_, res) => res);

export const Next = StaticMethodParameterExtractor('Next', (_, __, next) => next);

export const Body = <Result = unknown>(name: string | undefined = undefined) => {
  return DynamicParameterExtractor<string | undefined, Result>(
    'Body',
    (name, req) => (name ? req.body[name] : req.body),
    name,
  );
};

export const Cookie = <Result = unknown>(cookie_name: string) => {
  return DynamicParameterExtractor<Result, string>(
    'Cookie',
    (cookie_name, req) => req.cookies[cookie_name],
    cookie_name,
  );
};

export const PathVariable = (variable: string) => {
  return DynamicParameterExtractor<string>(
    'PathVariable',
    (variable, req) => {
      return req.params[variable];
    },
    variable,
  );
};

export const Param = (variable: string) => {
  return DynamicParameterExtractor<string>(
    'Param',
    (variable, req) => req.params[variable],
    variable,
  );
};

export const WholeQuery = StaticMethodParameterExtractor('Query', (req) => req.query);

export const Query = (parameter_name: string) => {
  return DynamicParameterExtractor<string>(
    'Query',
    (param, req) => req.query[param],
    parameter_name,
  );
};

export const Session = DynamicParameterExtractor('Session', (_, req) => req.session);
