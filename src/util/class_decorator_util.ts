import { ClassExtender } from "./class_extender";

export type Constructor<T = any> = new(...constr_arguments: any[]) => T;

export const extender = new ClassExtender();

export function BeforeCreate<T = any>(after_create: () => void): Constructor<T> | any {
  return (modifiable_constructor: Constructor<T>) =>
    extender.add_before_initialization<T>(modifiable_constructor, after_create);
}

export function SetProperty<T = any>(set_property: (new_instance: T) => void): Constructor<T> | any {
  return (modifiable_constructor: Constructor<T>) =>
    extender.add_set_property<T>(modifiable_constructor, set_property);
}

export function AfterCreate<T = any>(after_create: (new_instance: T) => void): Constructor<T> | any {
  return (modifiable_constructor: Constructor<T>) =>
    extender.add_after_initialization<T>(modifiable_constructor, after_create);
}


/**
 * The method has been deprecated, by the superior class Extender, which creates a lifecycle around item creation
 * @see ClassExtender
 * @deprecated
 * @param after_construct
 */
export function class_extender<ExtendedClass>(after_construct: (created_element: ExtendedClass) => void) {
  return function (old_class: Constructor<ExtendedClass>) {

    const new_class: any = function (...args: any[]) {
      const new_constructor: any = () => new old_class(...args);
      new_constructor.prototype = old_class.prototype;

      const instance = new_constructor();

      /**
       * This after_creations could be collected into an array, then executed!
       * Note: Added in
       */
      after_construct(instance);

      return instance;
    }

    new_class.prototype = old_class.prototype;
    return new_class;
  }
}
