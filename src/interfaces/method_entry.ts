
export interface MethodEntry {
  http_method: string; // keyof ExpressRouter
  object_method: string; // keyof <Current Object?>
  path: string;
}
