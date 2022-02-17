import {
  DynamicParameterExtractorFunction,
  ParameterExtractor,
  StaticParameterExtractorFunction,
} from '../../types';

/**
 * Note: Storage might be updated with unique ID generation for each Exctractor
 */
class _ParameterExtractorStorage {
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

  public get_parameter_extractor(extractor_name: string): ParameterExtractor {
    return this.custom_extractors[extractor_name] || this.built_in_extractors[extractor_name];
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
}

export const ParameterExtractorStorage = new _ParameterExtractorStorage();
