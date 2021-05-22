import { Constructor } from "./class_decorator_util";
interface CreationLifecycleMethodHolder<T> {
    before_initialization: ((new_class: Constructor<T>) => void)[];
    set_properties: ((new_instance: T) => void)[];
    after_initialization: ((new_instance: T) => void)[];
}
interface ClassExtenderStoredItem<T> extends CreationLifecycleMethodHolder<T> {
    new_constructor: Constructor<T>;
}
export declare class ClassExtender {
    private decorations;
    constructor();
    protected get_or_initialize<T>(original_constructor: Constructor<T>): ClassExtenderStoredItem<T>;
    protected initialize<T>(original_constructor: Constructor<T>): ClassExtenderStoredItem<T>;
    add_before_initialization<T>(original_constructor: Constructor<T>, before_initialization: any | CreationLifecycleMethodHolder<T>['before_initialization'][0]): any;
    add_set_property<T>(original_constructor: Constructor<T>, set_property: ((new_instance: T) => void)): Constructor<T>;
    add_after_initialization<T>(original_constructor: Constructor<T>, after_initialization: ((new_instance: T) => void)): Constructor<T>;
}
export {};
