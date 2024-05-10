import { SnSafeAny } from './any';

export type FunctionProp<T> = (...args: SnSafeAny[]) => T;
