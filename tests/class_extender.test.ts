import { BeforeCreate, SetProperty, AfterCreate } from "../src/decorators/util";

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
// @Adder(4)
@PrintAfterCreate()
// @ts-ignore
class A {
  b: number = 13;
}

@SetProperty((instance: B) => instance.name = 'Set_Property')
@PrintAfterCreate()
// @ts-ignore
class B {
  name: string = '';
}

new A();
new B();
