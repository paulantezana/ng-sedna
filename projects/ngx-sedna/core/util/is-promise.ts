import { SnSafeAny } from 'ngx-sedna/core/types';

export function isPromise<T>(obj: SnSafeAny): obj is Promise<T> {
  return !!obj && typeof obj.then === 'function' && typeof obj.catch === 'function';
}
