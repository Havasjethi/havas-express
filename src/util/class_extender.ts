import { Constructor, LifeCycleClassDecorator } from "./class_decorator_util";

interface CreationLifecycleMethods<T> {
  before_initialization: ((new_class: Constructor<T>) => void)[];
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
    // @ts-ignore
    const class_name = original_constructor.prototype.constructor.name;

    if (!this.decorations[class_name]) {
      this.decorations[class_name] = this.initialize(original_constructor);
    }

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
      // @ts-ignore
      const new_constructor: (() => T) = () => {
        const new_instance = new original_constructor(...args);
        // @ts-ignore
        stored_item.set_properties.forEach(fnc => fnc(new_instance));

        return new_instance;
      };

      new_constructor.prototype = original_constructor.prototype;

      stored_item.before_initialization.forEach(e => e(new_class));
      const instance = new_constructor();
      stored_item.after_initialization.forEach(e => e(instance));

      return instance;
    }

    new_class.prototype = original_constructor.prototype;

    stored_item.new_constructor = new_class;

    return stored_item;
  }

  add_before_initialization<T>
  (original_constructor: Constructor<T>, before_initialization: any |CreationLifecycleMethods<T>['before_initialization'][0])
  : any{
    const stored_item = this.get_or_initialize<T>(original_constructor);
    stored_item.before_initialization.push(before_initialization);
    return stored_item.new_constructor;
  }

  add_set_property<T>(original_constructor: Constructor<T>, set_property: ((new_instance: T) => void)) {
    const stored_item = this.get_or_initialize<T>(original_constructor);
    stored_item.set_properties.push(set_property);
    return stored_item.new_constructor;
  }

  add_after_initialization<T>(
    original_constructor: Constructor<T>,
    after_initialization: ((new_instance: T) => void)
  ):Constructor<T> {
    const stored_item = this.get_or_initialize<T>(original_constructor)
    stored_item.after_initialization.push(after_initialization);
    return stored_item.new_constructor;
  }
}
