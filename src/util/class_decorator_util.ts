import { ClassExtender } from './class_extender';

export type Constructor<T = any> = new (...constr_arguments: any[]) => T;

export type LifeCycleClassDecorator<T> = (
  original_constructor: Constructor<T>,
) => Constructor<T> | any;

export const extender = new ClassExtender();

/**
 * Returns a wrapped constructor
 */
export function OnlyWrap<T>(target: Constructor<T>): Constructor<T> {
  return extender.wrapClass(target);
}

export function BeforeCreate<T = any>(
  after_create: (e: Constructor<T> | any) => void,
): LifeCycleClassDecorator<T> {
  return <U extends T>(modifiable_constructor: Constructor<U>) =>
    extender.add_before_initialization(modifiable_constructor, after_create);
}

export function SetProperty<T = any>(
  set_property: (newInstance: T) => void,
): LifeCycleClassDecorator<T> {
  return <U extends T>(modifiable_constructor: Constructor<U>) =>
    extender.add_set_property(modifiable_constructor, set_property);
}

export function AfterCreate<T = any>(
  after_create: (newInstance: T) => void,
): LifeCycleClassDecorator<T> {
  return <U extends T>(modifiable_constructor: Constructor<U>) =>
    extender.add_after_initialization(modifiable_constructor, after_create);
}
