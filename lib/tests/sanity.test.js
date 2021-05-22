"use strict";
test('Sanity Tests', function () {
    expect('undefined').toBe('undefined');
    expect(13).toBe(13);
    expect(1 + 1).toBe(2);
    expect(undefined).toBe(undefined);
    expect(undefined).toBeUndefined();
    expect(null).toBe(null);
    expect(null).toBeNull();
    expect({}).toBeDefined();
    expect(0.1 + 0.2).toBeCloseTo(0.3);
});
