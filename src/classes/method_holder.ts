
export abstract class MethodHolder {
  public get_static(): typeof MethodHolder {
    // @ts-ignore
    return this.constructor;
  }
}
