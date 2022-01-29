import { DynamicParameterExctractorFunction } from './parameter_exctractor_storage';
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

export const WholeBody = StaticMethodParameterExtractor('WholeBody', (req) => req.body);

export const Body = DynamicParameterExtractor<string>('Body', (name, req) =>
  name ? req.body[name as string] : req.body,
);

export const Cookie = DynamicParameterExtractor<string>(
  'Cookie',
  (cookie_name, req) => req.cookies[cookie_name],
);

export const PathVariable = DynamicParameterExtractor<string>(
  'PathVariable',
  (variable, req) => req.params[variable],
);

export const Param = PathVariable;

export const WholeQuery = StaticMethodParameterExtractor('WholeQuery', (req) => req.query);

export const Query = DynamicParameterExtractor<string>('Query', (param, req) => req.query[param]);

export const Session = StaticMethodParameterExtractor('Session', (req) => req.session);
