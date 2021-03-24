export function Path(path: string) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    //@ts-ignore
    constructor.path = path;
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
