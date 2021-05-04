import { BeforeCreate, SetProperty, AfterCreate, extender, Constructor } from "../src/util/class_decorator_util";

function Subtractor<T extends A>(value: number) {
  return SetProperty<T>((instance) => {
    instance.b -= value;
  });
}

function Adder<T extends A>(value: number) {
  return SetProperty<T>((instance) => instance.b += value);
}

function PrintAfterCreate(print_object = true) {
  return AfterCreate<any>(item => {
    const args = [`${item.constructor.name} instance has been created`];
    if (print_object) {
      args.push(item);
    }
    console.log(...args);
  })
}

// @Subtractor(3)
@Adder(4)
@PrintAfterCreate()
@(<T>(some: Constructor<T>) => {
  extender.add_after_initialization(some, e => console.log('Heyy,', e));
})
class A {
  b: number = 13;
}

@SetProperty((instance: B) => {
  console.log('B-@SetProperty Called')
  instance.name = 'Set_Property'
})
@PrintAfterCreate()
class B {
  name: string | undefined;
}

new A();
new B();
