import { MethodParameterExtractor } from './util_methods';


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

export const RequestObj = MethodParameterExtractor('Request', (_, req) => req);

export const ResponseObj = MethodParameterExtractor('Response', (_, __, res) => res);

export const Next = MethodParameterExtractor('Next', (_, __, ___, next) => next);

export const Body = (name: string | undefined = undefined) => {
  return MethodParameterExtractor('Body', (name, req) => name ? req.body[name] : req.body, name);
};


export const Cookie = (cookie_name: string) => {
  return MethodParameterExtractor('Cookie', (cookie_name, req) => req.cookies[cookie_name], cookie_name);
};

export const PathVariable = (variable: string) => {
  return MethodParameterExtractor('PathVariable', (variable, req) => {
    console.log({
      variable: variable,
      paths: req.params,
    });
    return req.params[variable];
  }, variable);
};

export const Param = (variable: string) => {
  return MethodParameterExtractor('Param', (variable, req) => req.params[variable], variable);
};


export const WholeQuery = MethodParameterExtractor('Query', (_, req) => req.query);

export const Query = (parameter_name: string) => {
  return MethodParameterExtractor('Query', (param, req) => req.query[param], parameter_name);
};

export const Session = MethodParameterExtractor('Session', (_, req) => req.session);
