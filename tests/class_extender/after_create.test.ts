import { AfterCreate } from "../../src/util/class_decorator_util";

describe('@AfterCreate tests', () => {

  @AfterCreate<ClassA>((instance) => {instance.some_name = instance.some_name.toUpperCase()})
  class ClassA {
    static y: number = 13;
    constructor(public some_name: string) { }
  }


  @AfterCreate<ClassB>((instance) => {instance.x += 1})
  @AfterCreate<ClassB>((instance) => {instance.x += 1})
  class ClassB {
    constructor(public x: number) { }
  }

  function Add_To_X (value: number) {
    return AfterCreate(instance => instance.x += value);
  }

  @Add_To_X(10)
  class ClassC extends ClassB { }

  const random_string = 'random_string';


  test('ClassA works', () => {
    const a_instance = new ClassA(random_string);

    expect(a_instance.some_name).toBe(random_string.toUpperCase());
  });

  test('ClassB works', () => {
    const b_instance_1 = new ClassB(3);
    const b_instance_2 = new ClassB(5);

    expect(b_instance_1.x).toBe(3 + 2);
    expect(b_instance_2.x).toBe(5 + 2);
  });

  test('ClassB works', () => {
    const c_instance = new ClassC(-1);

    expect(c_instance.x).toBe(-1 + (2 + 10));
  });

});
