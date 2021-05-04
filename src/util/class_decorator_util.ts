import { ClassExtender } from "./class_extender";

export type Constructor<T = any> = new(...constr_arguments: any[]) => T;

export const extender = new ClassExtender();

export function BeforeCreate<Type = any>(after_create: () => void) {
  return (modifiable_constructor: Constructor<Type>) =>
    extender.add_before_initialization<Type>(modifiable_constructor, after_create);
}

export function SetProperty<Type = any>(set_property: (a: Type) => void) {
  return (modifiable_constructor: Constructor<Type>) =>
    extender.add_set_property<Type>(modifiable_constructor, set_property);
}

export function AfterCreate<Type = any>(after_create: (a: Type) => void) {
  return (modifiable_constructor: Constructor<Type>) =>
    extender.add_after_initialization<Type>(modifiable_constructor, after_create);
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
