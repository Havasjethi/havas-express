import { NextFunction } from 'express';
import { Request, Response } from '../../../index';

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

/**
 * TODO:: Add Static Parameter extractors for flexing
 */
export const ParameterExtractorStorage = new (class {
  constructor(
    public _predefined_extractors: { [key: string]: ParameterExtractor } = {},
    public _custom_extractors: {
      [key: string]: ParameterExtractor;
    } = {},
  ) {}

  get custom_extractors(): { [key: string]: ParameterExtractor } {
    return this._custom_extractors;
  }

  get built_in_extractors(): { [key: string]: ParameterExtractor } {
    return this._predefined_extractors;
  }

  /**
   * @param {string} extractorName This value should be unique
   * @param {ParameterExtractor} method
   */
  public register_static_parameter_extractor(
    extractorName: string,
    method: StaticParameterExtractorFunction,
  ) {
    this._custom_extractors[extractorName] = {
      extractor: method,
      type: 'Static',
    };
  }

  public register_dynamic_parameter_extractor<Args, Result>(
    extractor_name: string,
    method: DynamicParameterExtractorFunction<Result, Args>,
  ) {
    // Type removed
    this._custom_extractors[extractor_name] = {
      type: 'Dynamic',
      extractor: method as DynamicParameterExtractorFunction,
    };
  }

  public is_custom(extractor_name: string) {
    return this.custom_extractors[extractor_name] !== undefined;
  }

  public get_parameter_extractor(extractor_name: string): ParameterExtractor {
    return this.custom_extractors[extractor_name] || this.built_in_extractors[extractor_name];
  }

  /**
   * @throws {Error}
   */
  public get_parameter_extractor_safe(extractor_name: string): ParameterExtractor {
    const result = this.get_parameter_extractor(extractor_name);

    if (!result) {
      throw new Error('Cannot extractor method!');
    }

    return result;
  }

  // public get_as_entry<T = unknown>(extractor_name: string): ParameterExtractorEntry<T> {
  //   if (Object.keys(this.custom_extractors).includes(extractor_name)) {
  //     return {
  //       name: extractor_name,
  //       built_in: false,
  //       method: this.custom_extractors[extractor_name] as ParameterExtractor<T>,
  //     };
  //   } else {
  //     return {
  //       name: extractor_name,
  //       built_in: true,
  //       method: this.built_in_extractors[extractor_name] as ParameterExtractor<T>,
  //     };
  //   }
  // }
})();

// Note :: All parameter extractors are registered into a single Array, 'a' overrides 'a'
//
// export const createCustomExtractor = (
//   name: string,
//   method: DynamicParameterExtractorFunction | StaticParameterExtractorFunction,
// ) => {
//   // ParameterExtractorStorage.register_static_parameter_extractor(name, method);
//   //
//   // return (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
//   //   parameterExtractor(target, method_name, parameter_index, name, []);
//   // };
// };
//
// export const createCustomParameterExtractor = <Arguments extends []>(
//   name: string,
//   method: DynamicParameterExtractorFunction,
// ) => {
//   // ParameterExtractorStorage.register_dynamic_parameter_extractor(name, method);
//   //
//   // return (...args: Arguments) =>
//   //   (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
//   //     parameterExtractor(target, method_name, parameter_index, name, args);
//   //   };
// };
