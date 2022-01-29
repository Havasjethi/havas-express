import { NextFunction } from 'express';
import { Request, Response } from '../../index';

export type ParameterExctractor = StaticParameterExctractor | DynamicParameterExctractor;

export interface StaticParameterExctractor {
  type: 'Static';
  extractor: StaticParameterExctractorFunction;
}
export interface DynamicParameterExctractor {
  type: 'Dynamic';
  extractor: DynamicParameterExctractorFunction;
}

export type StaticParameterExctractorFunction<T = unknown> = (
  req: Request,
  res: Response,
  next: NextFunction,
  error?: any,
) => T;

export type DynamicParameterExctractorFunction<Result = unknown, Arg = unknown> = (
  args: Arg,
  req: Request,
  res: Response,
  next: NextFunction,
  error?: any,
) => Result;

// export type ParameterExctractorEntry<T = unknown> = {
//   name: string;
//   built_in: boolean;
//   method: ParameterExctractor<T>;
// };

/**
 * TODO:: Add Static Parameter extractors for flexig
 */
export const ParameterExtractorStorage = new (class {
  constructor(
    public _predefined_extractors: { [key: string]: ParameterExctractor } = {},
    public _custom_extractors: {
      [key: string]: ParameterExctractor;
    } = {},
  ) {}

  get custom_extractors(): { [key: string]: ParameterExctractor } {
    return this._custom_extractors;
  }

  get predefined_extractors(): { [key: string]: ParameterExctractor } {
    return this._predefined_extractors;
  }

  get built_in_extractors(): { [key: string]: ParameterExctractor } {
    return this._predefined_extractors;
  }

  /**
   * @param {string} extractorName This value should be uniqe
   * @param {ParameterExctractor} method
   */
  public register_static_parameter_extractor(
    extractorName: string,
    method: StaticParameterExctractorFunction,
  ) {
    this._custom_extractors[extractorName] = {
      extractor: method,
      type: 'Static',
    };
  }

  public register_dynamic_parameter_extractor<Args, Result>(
    extractor_name: string,
    method: DynamicParameterExctractorFunction<Result, Args>,
  ) {
    // Type removed
    this._custom_extractors[extractor_name] = {
      type: 'Dynamic',
      extractor: method as DynamicParameterExctractorFunction,
    };
  }

  public is_custom(extractor_name: string) {
    return this.custom_extractors[extractor_name] !== undefined;
  }

  public get_parameter_extractor(extractor_name: string): ParameterExctractor {
    return this.custom_extractors[extractor_name] || this.built_in_extractors[extractor_name];
  }

  public get_parameter_extractor_safe(extractor_name: string) {
    const result = this.get_parameter_extractor(extractor_name);

    if (!result) {
      throw new Error('Cannot extractor method!');
    }

    return result;
  }

  // public get_as_entry<T = unknown>(extractor_name: string): ParameterExctractorEntry<T> {
  //   if (Object.keys(this.custom_extractors).includes(extractor_name)) {
  //     return {
  //       name: extractor_name,
  //       built_in: false,
  //       method: this.custom_extractors[extractor_name] as ParameterExctractor<T>,
  //     };
  //   } else {
  //     return {
  //       name: extractor_name,
  //       built_in: true,
  //       method: this.built_in_extractors[extractor_name] as ParameterExctractor<T>,
  //     };
  //   }
  // }
})();

export const createCustumExtractor = (
  name: string,
  method: DynamicParameterExctractorFunction | StaticParameterExctractorFunction,
) => {
  // ParameterExtractorStorage.register_static_parameter_extractor(name, method);
  //
  // return (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
  //   parameterExtractor(target, method_name, parameter_index, name, []);
  // };
};

export const createCustumParameteredExtractor = <Arguments extends []>(
  name: string,
  method: DynamicParameterExctractorFunction,
) => {
  // ParameterExtractorStorage.register_dynamic_parameter_extractor(name, method);
  //
  // return (...args: Arguments) =>
  //   (target: ExpressCoreRoutable, method_name: string, parameter_index: number) => {
  //     parameterExtractor(target, method_name, parameter_index, name, args);
  //   };
};
