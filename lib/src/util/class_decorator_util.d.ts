import { ClassExtender } from "./class_extender";
export declare type Constructor<T = any> = new (...constr_arguments: any[]) => T;
export declare type LifeCycleClassDecorator<T> = (original_constructor: Constructor<T>) => Constructor<T> | any;
export declare const extender: ClassExtender;
export declare function BeforeCreate<T = any>(after_create: (e: Constructor<T> | any) => void): LifeCycleClassDecorator<T>;
export declare function SetProperty<T = any>(set_property: (new_instance: T) => void): LifeCycleClassDecorator<T>;
export declare function AfterCreate<T = any>(after_create: (new_instance: T) => void): LifeCycleClassDecorator<T>;
/**
 * The method has been deprecated, by the superior ClassExtender, which creates a lifecycle around item creation
 * @see ClassExtender
 * @deprecated
 * @param after_construct
 */
export declare function class_extender<ExtendedClass>(after_construct: (created_element: ExtendedClass) => void): (old_class: Constructor<ExtendedClass>) => any;
