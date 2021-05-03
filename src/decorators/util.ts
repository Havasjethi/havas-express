
export type Constructor<T = any> = new(...constr_arguments: any[]) => T;

export function class_extender<ExtendedClass> (after_construct: (created_element: ExtendedClass) => void) {
  return function (old_class: Constructor<ExtendedClass>) {

    const new_class: any = function (...args: any[]) {
      const new_constructor: any = () => new old_class(...args);
      new_constructor.prototype = old_class.prototype; // What happens here?

      const instance = new_constructor();
      after_construct(instance);  // This after_creations could be collected into an array, then executed!

      return instance;
    }

    new_class.prototype = old_class.prototype;
    return new_class;
  }
}
