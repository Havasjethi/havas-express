import { Constructor } from "./class_decorator_util";

interface CreationLifecycleMethodHolder<T> {
  before_initialization: ((new_class: Constructor<T>) => void)[];
  set_properties: ((new_instance: T) => void)[];
  after_initialization: ((new_instance: T) => void)[];
}

interface ClassExtenderStoredItem<T> extends CreationLifecycleMethodHolder<T> {
  new_constructor?: Constructor<T>;
}

export class ClassExtender {
  private decorations: { [class_name: string]: ClassExtenderStoredItem<any> };

  constructor() {
    this.decorations = {};
  }

  protected get_or_init_empty (class_name: string): ClassExtenderStoredItem<any> {
    return this.get_or_initialize_stored_item(class_name);
  }

  protected get_or_initialize<T>(original_constructor: Constructor<T>): Required<ClassExtenderStoredItem<T>> {
    const class_name = original_constructor.prototype.constructor.name;
    const item = this.get_or_initialize_stored_item<T>(class_name);

    if (!item.new_constructor) {
      this.create_lifecycle_constructor(original_constructor, item);
    }

    return item as Required<ClassExtenderStoredItem<T>>;
  }

  protected get_or_initialize_stored_item<T>(class_name: string): ClassExtenderStoredItem<T> {
    if (!this.decorations[class_name]) {
      this.decorations[class_name] = {
        before_initialization: [],
        set_properties: [],
        after_initialization: [],
      };
    }

    return this.decorations[class_name];
  }

  protected create_lifecycle_constructor<T>(original_constructor: Constructor<T>, stored_item: ClassExtenderStoredItem<T>): void {
    const new_constructor: any = function (...args: any[]) {
      const wrapped_constructor: (() => T) = () => {
        const new_instance = new original_constructor(...args);
        stored_item.set_properties.forEach(fnc => fnc(new_instance));

        return new_instance;
      };

      wrapped_constructor.prototype = original_constructor.prototype;

      stored_item.before_initialization.forEach(e => e(new_constructor));
      const instance = wrapped_constructor();
      stored_item.after_initialization.forEach(e => e(instance));

      return instance;
    }

    new_constructor.prototype = original_constructor.prototype;

    stored_item.new_constructor = new_constructor;
  }

  public before_initialization<T> (class_name: string, method_to_run: CreationLifecycleMethodHolder<T>['before_initialization'][0]) {
    const stored_item = this.get_or_initialize_stored_item<T>(class_name);
    stored_item.before_initialization.push(method_to_run);
  }

  public set_property<T> (class_name: string, method_to_run: ((new_instance: T) => void)) {
    const stored_item = this.get_or_initialize_stored_item<T>(class_name);
    stored_item.set_properties.push(method_to_run);
  }

  public after_initialization<T> (class_name: string, method_to_run: ((new_instance: T) => void)) {
    const stored_item = this.get_or_initialize_stored_item<T>(class_name);
    stored_item.after_initialization.push(method_to_run);
  }

  public add_before_initialization<T> (
    original_constructor: Constructor<T>,
    before_initialization: any | CreationLifecycleMethodHolder<T>['before_initialization'][0]
  ): Constructor<T> {
    const stored_item = this.get_or_initialize<T>(original_constructor);
    stored_item.before_initialization.push(before_initialization);
    return stored_item.new_constructor;
  }

  public add_set_property<T>(
    original_constructor: Constructor<T>,
    set_property: ((new_instance: T) => void)
  ): Constructor<T> {
    const stored_item = this.get_or_initialize<T>(original_constructor);
    stored_item.set_properties.push(set_property);
    return stored_item.new_constructor;
  }

  public add_after_initialization<T>(
    original_constructor: Constructor<T>,
    after_initialization: ((new_instance: T) => void)
  ): Constructor<T> {
    const stored_item = this.get_or_initialize<T>(original_constructor)
    stored_item.after_initialization.push(after_initialization);
    return stored_item.new_constructor;
  }
}
