import { NextFunction } from 'express';
import { Request, Response } from '../../index';


export type StaticParameterExctractor<T = unknown> = (req: Request, res: Response, next: NextFunction) => T;
export type DynamicParameterExctractor<T = unknown> = (args: any, req: Request, res: Response, next: NextFunction) => T;

export type ParameterExctractor<T = unknown> = DynamicParameterExctractor<T>;

export type ParameterExctractorEntry<T = unknown> = {
  name: string;
  built_in: boolean;
  method: ParameterExctractor<T>;
}

/**
 * TODO:: Add Static Parameter extractors for flexig
 */
export const ParameterExtractorStorage = new class {

  constructor (
    public _predefined_extractors: { [key: string]: ParameterExctractor } = {},
    public _custom_extractors: { [key: string]: ParameterExctractor } = {},
  ) {}

  get custom_extractors () {
    return this._custom_extractors;
  }

  get predefined_extractors () {
    return this._predefined_extractors;
  }
  get built_in_extractors () {
    return this._predefined_extractors;
  }

  /**
   * @param {string} extractor_name This value should be uniqe
   * @param {ParameterExctractor} method
   */
  public register_parameter_extractor (extractor_name: string, method: ParameterExctractor) {
    this._custom_extractors[extractor_name] = method;
  }

  public is_custom(extractor_name: string) {
    return Object.keys(this.custom_extractors).includes(extractor_name);
  }

  public get_parameter_extractor (extractor_name: string) {
    return this.is_custom(extractor_name)
      ? this.custom_extractors[extractor_name]
      : this.built_in_extractors[extractor_name];
  }

  public get_parameter_extractor_safe (extractor_name: string) {
    const result =  this.is_custom(extractor_name)
      ? this.custom_extractors[extractor_name]
      : this.built_in_extractors[extractor_name];

    if (!result) {
      throw new Error('Cannot extractor method!');
    }

    return result;
  }

  public get_as_entry<T = unknown> (extractor_name: string): ParameterExctractorEntry<T> {

    if (Object.keys(this.custom_extractors).includes(extractor_name)) {
      return {
        name: extractor_name,
        built_in: false,
        method: this.custom_extractors[extractor_name] as ParameterExctractor<T>,
      };
    } else {
      return {
        name: extractor_name,
        built_in: true,
        method: this.built_in_extractors[extractor_name] as ParameterExctractor<T>,
      };
    }
  }
};
