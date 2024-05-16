import { SnSafeAny } from './any';

export type NgClassType = string | string[] | Set<string> | NgClassInterface;

export interface NgClassInterface {
  [klass: string]: SnSafeAny;
}

export interface NgStyleInterface {
  [klass: string]: SnSafeAny;
}
