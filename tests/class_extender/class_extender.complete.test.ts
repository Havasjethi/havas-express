import { expect } from 'chai';
import { BeforeCreate, SetProperty, AfterCreate } from '../../src/util';


describe('Test Of Correct lifecycles', () => {

  @BeforeCreate((class_decl) => {
    class_decl.default_x = 100;
  })
  @SetProperty<A>((instance) => {
    instance.x += 3;
  })
  @AfterCreate<A>((instance) => {
    instance.x *= 2;
  })
  @SetProperty<A>((instance) => {
    instance.x += 10;
  })
  class A {
    public x: number;
    static default_x = -1;

    constructor(num: number | undefined = undefined) {
      this.x = num ?? A.default_x;
    }
  }

  it('Whole lifecycle of object A #1', () => {
    const a = new A();
    expect(a.x).equal((100 + 3 + 10) * 2);
  });

  it('Whole lifecycle of object A #2', () => {
    const a = new A(3);
    expect(a.x).equal((3 + 3 + 10) * 2);
  });
});
