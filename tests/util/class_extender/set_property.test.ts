import { SetProperty } from '../../../src/util';

describe('@SetProperty tests', () => {
  @SetProperty<ClassA>((instance) => {
    instance.some_name = instance.some_name.toUpperCase();
  })
  class ClassA {
    public static x: number = 13;
    constructor(public some_name: string = '') {}
  }

  @SetProperty<ClassB>((instance) => {
    instance.x += 1;
  })
  @SetProperty<ClassB>((instance) => {
    instance.x += 1;
  })
  class ClassB {
    constructor(public x: number) {}
  }

  function Add_To_X(value: number) {
    return SetProperty((instance) => (instance.x += value));
  }

  @Add_To_X(10)
  class ClassC extends ClassB {
    constructor(x: number) {
      super(x);
    }
  }

  const random_string = 'random_string';

  test('ClassA works', () => {
    const a_instance = new ClassA(random_string);

    expect(a_instance.some_name).toEqual(random_string.toUpperCase());
  });

  test('ClassB works', () => {
    const b_instance_1 = new ClassB(3);
    const b_instance_2 = new ClassB(5);

    expect(b_instance_1.x).toBe(3 + 2);
    expect(b_instance_2.x).toBe(5 + 2);
  });

  test('ClassC works', () => {
    const c_instance = new ClassC(-1);

    expect(c_instance.x).toBe(-1 + (2 + 10));
  });
});
