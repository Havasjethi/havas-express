import {Routable} from "./classes/method_holder";

export function Path(path: string) {
  return <T extends { new (...args: any[]): Routable<any> }>(constructorFunction: T) => {
    // constructor.call;
    // //@ts-ignore
    // constructor.path = path;

    let newConstructorFunction: any = function (...args: any[]) {
      const new_constructor: any = () => new constructorFunction(...args);
      new_constructor.prototype = constructorFunction.prototype;

      return new new_constructor(args)
        .set_path(path);
    }
    newConstructorFunction.prototype = constructorFunction.prototype;
    return newConstructorFunction;
  }
}

export function Host({
                       port_number = -1,
                       host = 'localhost',
                       auto_start = true} = {}) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    //@ts-ignore
    constructor.port = port_number;
    //@ts-ignore
    constructor.auto_start = auto_start;
    //@ts-ignore
    constructor.host = host;
  }
}
