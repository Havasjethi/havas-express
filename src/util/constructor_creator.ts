import { Constructor } from './class_decorator_util';
import { ClassExtenderStoredItem } from './class_extender';

/**
 * Able to create wrapped constructor function with matching argument length
 * up to 21 arguments.
 * This is required for inversify to work properly with unannotated properties.
 */
export const constructorWrapper = <T = unknown>(
  original_constructor: Constructor<T>,
  stored_item: ClassExtenderStoredItem<T>,
  // @ts-ignore
): Function => {
  switch (original_constructor.length) {
    case 0: {
      // @ts-ignore
      const new_constructor: any = function () {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor();

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 1: {
      const new_constructor: any = function (a: any) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 2: {
      // @ts-ignore
      const new_constructor: any = function (a: any, b: any) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 3: {
      // @ts-ignore
      const new_constructor: any = function (a: any, b: any, c: any) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 4: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 5: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 6: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e, f);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 7: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e, f, g);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 8: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e, f, g, h);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 9: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e, f, g, h, i);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 10: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i, j) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e, f, g, h, i, j);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 11: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i, j, k) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e, f, g, h, i, j, k);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 12: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i, j, k, l) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e, f, g, h, i, j, k, l);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 13: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i, j, k, l, m) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e, f, g, h, i, j, k, l, m);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 14: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i, j, k, l, m, n) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(a, b, c, d, e, f, g, h, i, j, k, l, m, n);

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 15: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n,
            o,
          );

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 16: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n,
            o,
            p,
          );

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 17: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n,
            o,
            p,
            q,
          );

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 18: {
      // @ts-ignore
      const new_constructor: any = function (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n,
            o,
            p,
            q,
            r,
          );

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 19: {
      const new_constructor: any = function (
        a: any,
        b: any,
        c: any,
        d: any,
        e: any,
        f: any,
        g: any,
        h: any,
        i: any,
        j: any,
        k: any,
        l: any,
        m: any,
        n: any,
        o: any,
        p: any,
        q: any,
        r: any,
        s: any,
      ) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n,
            o,
            p,
            q,
            r,
            s,
          );

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 20: {
      // @ts-ignore
      const new_constructor: any = function (
        a: any,
        b: any,
        c: any,
        d: any,
        e: any,
        f: any,
        g: any,
        h: any,
        i: any,
        j: any,
        k: any,
        l: any,
        m: any,
        n: any,
        o: any,
        p: any,
        q: any,
        r: any,
        s: any,
        t: any,
      ) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n,
            o,
            p,
            q,
            r,
            s,
            t,
          );

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
    case 21: {
      // @ts-ignore
      const new_constructor: any = function (
        a: any,
        b: any,
        c: any,
        d: any,
        e: any,
        f: any,
        g: any,
        h: any,
        i: any,
        j: any,
        k: any,
        l: any,
        m: any,
        n: any,
        o: any,
        p: any,
        q: any,
        r: any,
        s: any,
        t: any,
        u: any,
      ) {
        const wrapped_constructor: () => T = () => {
          //@ts-ignore
          const new_instance = new original_constructor(
            a,
            b,
            c,
            d,
            e,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n,
            o,
            p,
            q,
            r,
            s,
            t,
            u,
          );

          stored_item.set_properties.forEach((fnc) => fnc(new_instance));

          return new_instance;
        };

        wrapped_constructor.prototype = original_constructor.prototype;

        stored_item.before_initialization.forEach((e) => e(new_constructor));
        const instance = wrapped_constructor();

        stored_item.after_initialization.forEach((e) => e(instance));

        return instance;
      };
      return new_constructor;
    }
  }
};

// const evilMethodArgsCreator = (argsLength: number): string => {
//   const letters = [];
//   let current = '';
//   while (letters.length < argsLength) {
//     current += 'a';
//     letters.push(current);
//   }
//   return letters.join(', ');
// };
//
// const evilMethodCreator = (new_constructor: Function, argsLength: number): Function => {
//   return new Function(evilMethodArgsCreator(argsLength), evileMethodBodyGetter(new_constructor));
// };
//
// const evileMethodBodyGetter = (x: Function): string => {
//   const fnc = x.toString();
//
//   return fnc.slice(fnc.indexOf('{') + 1, fnc.lastIndexOf('}'));
// };
