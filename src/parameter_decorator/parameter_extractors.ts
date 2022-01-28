import { CreateDynamicParameterExtractor, CreateStaticParameterExtractor } from './util_methods';

export const Request = CreateStaticParameterExtractor('Request', (req) => req);
export const RequestObj = Request;

export const Response = CreateStaticParameterExtractor('Response', (_, res) => res);
export const ResponseObj = Response;

export const Next = CreateStaticParameterExtractor('Next', (_, __, next) => next);

export const WholeBody = CreateStaticParameterExtractor('WholeBody', (req) => req.body);

export const Body = CreateDynamicParameterExtractor<string>('Body', (name, req) =>
  name ? req.body[name as string] : req.body,
);

export const Cookie = CreateDynamicParameterExtractor<string>(
  'Cookie',
  (cookie_name, req) => req.cookies[cookie_name],
);

export const PathVariable = CreateDynamicParameterExtractor<string>(
  'PathVariable',
  (variable, req) => req.params[variable],
);

export const Param = PathVariable;

export const WholeQuery = CreateStaticParameterExtractor('WholeQuery', (req) => req.query);

export const Query = CreateDynamicParameterExtractor<string>(
  'Query',
  (param, req) => req.query[param],
);

export const Session = CreateStaticParameterExtractor('Session', (req) => req.session);

export const Header = CreateDynamicParameterExtractor<string>(
  'Header',
  (headerName, req) => req.headers[headerName],
);
