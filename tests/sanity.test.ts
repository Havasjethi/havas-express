import { expect } from 'chai';

it('Sanity Tests', () => {
  expect('undefined').eq('undefined');
  expect(13).eq(13);
  expect(1 + 1).eq(2);

  expect(undefined).eq(undefined);
  expect(undefined).undefined;
  expect(null).eq(null);

  expect(0.1 + 0.2, 'Adding').approximately(0.3, 0.01);
});
