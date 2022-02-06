import { expect } from 'chai';
import { BeforeCreate, Constructor } from '../../src/util/class_decorator_util';

let value_to_reset = 13;

@BeforeCreate<ClassA>((e) => {
  value_to_reset = 0;
  e.static_property += 1;
})
class ClassA {
  public x: number = 0;

  static static_property: number = 13;
}

describe('@BeforeCreate tests', () => {
  it('@BeforeCreate works', () => {
    const before = ClassA.static_property;
    new ClassA();

    expect(before + 1).equal(ClassA.static_property);
  });
});
