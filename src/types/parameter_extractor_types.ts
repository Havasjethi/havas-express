import { NextFunction } from 'express';
import { Request, Response } from '../../index';

export type ParameterExtractor = StaticParameterExtractor | DynamicParameterExtractor;

export interface StaticParameterExtractor {
  type: 'Static';
  extractor: StaticParameterExtractorFunction;
}

export interface DynamicParameterExtractor {
  type: 'Dynamic';
  extractor: DynamicParameterExtractorFunction;
}

export type StaticParameterExtractorFunction<T = unknown, R = unknown> = (
  req: Request,
  res: Response,
  next: NextFunction,
  error?: any,
  result?: R,
) => T;

export type DynamicParameterExtractorFunction<T = unknown, Arg = unknown> = (
  args: Arg,
  req: Request,
  res: Response,
  next: NextFunction,
  error?: any,
) => T;
