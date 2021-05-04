
export type Constructor<T = any> = new(...constr_arguments: any[]) => T;

export function class_extender<ExtendedClass>(after_construct: (created_element: ExtendedClass) => void) {
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


interface CreationLifecycleMethods<T> {
  before_initialization: (() => void)[];
  set_properties: ((new_instance: T) => void)[];
  after_initialization: ((new_instance: T) => void)[];
}

interface StoredItem<T> extends CreationLifecycleMethods<T> {
  new_constructor: Constructor<T>;
}

export class ClassExtender {
  private decorations: { [class_name: string]: StoredItem<any> };

  constructor() {
    this.decorations = {};
  }

  get_or_initialize<T>(original_constructor: Constructor<T>): StoredItem<T> {
    const class_name = original_constructor.name;

    if (!this.decorations[class_name]) {
      this.decorations[class_name] = this.initialize(original_constructor);
    }
    console.log({
      class_name,
      returned: this.decorations[class_name],
    });

    return this.decorations[class_name];
  }

  initialize<T>(original_constructor: Constructor<T>): StoredItem<T> {
    const stored_item: StoredItem<T> = {
      before_initialization: [],
      set_properties: [],
      after_initialization: [],
      //@ts-ignore
      new_constructor: null,
    };

    const new_class: any = function (...args: any[]) {

      const new_constructor: (() => T) = () => {
        const new_instance = new original_constructor(...args);
        stored_item.set_properties.forEach(fnc => fnc(new_instance));

        return new_instance;
      };

      new_constructor.prototype = original_constructor.prototype;

      stored_item.before_initialization.forEach(e => e());
      const instance = new_constructor();
      stored_item.after_initialization.forEach(e => e(instance));

      return instance;
    }

    new_class.prototype = original_constructor.prototype;

    stored_item.new_constructor = new_class;

    return stored_item;
  }

  add_before_initialization<T>(original_constructor: Constructor<T>, before_initialization: (() => void)) {
    const stored_item = this.get_or_initialize<T>(original_constructor);
    stored_item.before_initialization.push(before_initialization);
    return stored_item.new_constructor;
  }

  add_set_property<T>(original_constructor: Constructor<T>, set_property: ((new_instance: T) => void)) {
    const stored_item = this.get_or_initialize<T>(original_constructor);
    stored_item.set_properties.push(set_property);
    return stored_item.new_constructor;
  }

  add_after_initialization<T>(original_constructor: Constructor<T>, after_initialization: ((new_instance: T) => void)) {
    const stored_item = this.get_or_initialize<T>(original_constructor)
    stored_item.after_initialization.push(after_initialization);
    return stored_item.new_constructor;
  }
}

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
