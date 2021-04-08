
export function after_create<Type>(after_create: (a: Type) => void) {
  return class_extender<Type, any>(after_create);
}

export function class_extender<
  ExtendedClass,
  Constructor extends { new(...constr_arguments: any[]): ExtendedClass} = any
  >(after_construct: (created_element: ExtendedClass) => void) {
  return function (old_class: Constructor) {

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
