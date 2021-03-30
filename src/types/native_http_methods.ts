import {IRouter} from "express";

export type ExpressHttpMethod = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';

// export type ExpressHttpMethod = keyof IRouter;
// export type ExpressHttpMethod = 'checkout'
//   | 'get'
//   | 'post'
//   | 'patch'
//   | 'put'
//   | 'delete'
//   | 'all'
//   | 'copy'
//   | 'head'
//   | 'lock'
//   | 'merge'
//   | 'mkactivity'
//   | 'mkcol'
//   | 'move'
//   | 'm-search'
//   | 'notify'
//   | 'options'
//   | 'purge'
//   | 'report'
//   | 'search'
//   | 'subscribe'
//   | 'trace'
//   | 'unlock'
//   | 'unsubscribe'
