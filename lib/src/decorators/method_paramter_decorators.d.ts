import { Routable } from "../classes/routable";
declare type TargetType = Routable<any>;
export declare const RequestObj: (target: TargetType, method_name: string, parameter_index: number) => void;
export declare const ResponseObj: (target: TargetType, method_name: string, parameter_index: number) => void;
export declare const Next: (target: TargetType, method_name: string, parameter_index: number) => void;
export declare const Cookie: (name: string) => (target: TargetType, method_name: string, parameter_index: number) => void;
export declare const Body: (name: string) => (target: TargetType, method_name: string, parameter_index: number) => void;
export declare const PathVariable: (name: string) => (target: TargetType, method_name: string, parameter_index: number) => void;
export declare const Param: (name: string) => (target: TargetType, method_name: string, parameter_index: number) => void;
export declare const Query: (name: string) => (target: TargetType, method_name: string, parameter_index: number) => void;
export {};
