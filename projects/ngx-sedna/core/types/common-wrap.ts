import { SnSafeAny } from './any';

// Define a property that can also returned by called function
export type FunctionProp<T> = (...args: SnSafeAny[]) => T;
