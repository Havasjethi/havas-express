import { Constructor } from './class_decorator_util';
import { constructorWrapper } from './constructor_creator';

export const wrapperConstructorName = 'new_constructor';

interface CreationLifecycleMethodHolder<T> {
  beforeInitialization: ((new_class: Constructor<T>) => void)[];
  setProperties: ((new_instance: T) => void)[];
  afterInitialization: ((new_instance: T) => void)[];
}

export interface ClassExtenderStoredItem<T> extends CreationLifecycleMethodHolder<T> {
  new_constructor?: Constructor<T>;
}

export class ClassExtender {
  private readonly decorations: { [class_name: string]: ClassExtenderStoredItem<any> };

  public constructor() {
    this.decorations = {};
  }

  public before_initialization<T>(
    class_name: string,
    method_to_run: CreationLifecycleMethodHolder<T>['beforeInitialization'][0],
  ) {
    this.beforeInitialization(class_name, method_to_run);
  }

  public wrapClass<T>(classTarget: Constructor<T>): Constructor<T> {
    return this.getInitializedWrapped(classTarget).new_constructor;
  }

  public beforeInitialization<T>(
    className: string,
    methodToRun: CreationLifecycleMethodHolder<T>['beforeInitialization'][0],
  ) {
    const stored_item = this.getStoredItem<T>(className);
    stored_item.beforeInitialization.push(methodToRun);
  }

  public setProperty<T>(class_name: string, method_to_run: (new_instance: T) => void) {
    const stored_item = this.getStoredItem<T>(class_name);
    stored_item.setProperties.push(method_to_run);
  }

  public set_property<T>(class_name: string, method_to_run: (new_instance: T) => void) {
    return this.setProperty(class_name, method_to_run);
  }

  public after_initialization<T>(class_name: string, method_to_run: (new_instance: T) => void) {
    const stored_item = this.getStoredItem<T>(class_name);
    stored_item.afterInitialization.push(method_to_run);
  }

  public add_before_initialization<T>(
    original_constructor: Constructor<T>,
    before_initialization: any | CreationLifecycleMethodHolder<T>['beforeInitialization'][0],
  ): Constructor<T> {
    const stored_item = this.getInitializedWrapped<T>(original_constructor);
    stored_item.beforeInitialization.push(before_initialization);
    return stored_item.new_constructor;
  }

  public add_set_property<T>(
    original_constructor: Constructor<T>,
    set_property: (new_instance: T) => void,
  ): Constructor<T> {
    const stored_item = this.getInitializedWrapped<T>(original_constructor);
    stored_item.setProperties.push(set_property);
    return stored_item.new_constructor;
  }

  public add_after_initialization<T>(
    original_constructor: Constructor<T>,
    after_initialization: (new_instance: T) => void,
  ): Constructor<T> {
    const stored_item = this.getInitializedWrapped<T>(original_constructor);
    stored_item.afterInitialization.push(after_initialization);
    return stored_item.new_constructor;
  }

  protected get_or_init_empty(class_name: string): ClassExtenderStoredItem<any> {
    return this.getStoredItem(class_name);
  }

  protected getInitializedWrapped<T>(
    original_constructor: Constructor<T>,
  ): Required<ClassExtenderStoredItem<T>> {
    const class_name = original_constructor.prototype.constructor.name;
    const item = this.getStoredItem<T>(class_name);

    if (!item.new_constructor) {
      this.create_lifecycle_constructor(original_constructor, item);
    }

    return item as Required<ClassExtenderStoredItem<T>>;
  }

  protected getStoredItem<T>(class_name: string): ClassExtenderStoredItem<T> {
    if (!this.decorations[class_name]) {
      this.decorations[class_name] = {
        beforeInitialization: [],
        setProperties: [],
        afterInitialization: [],
      };
    }

    return this.decorations[class_name];
  }

  protected create_lifecycle_constructor<T>(
    original_constructor: Constructor<T>,
    stored_item: ClassExtenderStoredItem<T>,
  ): void {
    const new_constructor = constructorWrapper(original_constructor, stored_item);

    new_constructor.prototype = original_constructor.prototype;

    if (
      Reflect &&
      // @ts-ignore
      Reflect.getMetadataKeys !== undefined &&
      // @ts-ignore
      Reflect.defineMetadata !== undefined &&
      // @ts-ignore
      Reflect.getMetadata !== undefined
    ) {
      // @ts-ignore
      Reflect.getMetadataKeys(original_constructor).forEach((key) => {
      // @ts-ignore
        Reflect.defineMetadata(
          key,
      // @ts-ignore
          Reflect.getMetadata(key, original_constructor),
          new_constructor,
        );
      });
    }

    // @ts-ignore
    stored_item.new_constructor = new_constructor;
  }
}
