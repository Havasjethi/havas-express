export type UniversalPostProcessor = ProcessorFunction | ProcessorToken | ProcessorFactoryToken;
export type ProcessorFunction<Args = any, T = any> = (args: Args) => T | Promise<T>;
export type ProcessorToken = { token: string };
export type ProcessorFactoryToken = { token: string; args: any };

export function isProcessorFactory(
  v: ProcessorToken | ProcessorFactoryToken,
): v is ProcessorFactoryToken {
  return v.hasOwnProperty('args');
}

export type DynamicProcessorFunction<T = unknown> = (processable: any, dynArg: T) => any;
