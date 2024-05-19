

import { isDevMode } from '@angular/core';

import { environment } from 'ngx-sedna/core/environments';
import { SnSafeAny } from 'ngx-sedna/core/types';

const record: Record<string, boolean> = {};

export const PREFIX = '[NG-ZORRO]:';

function notRecorded(...args: SnSafeAny[]): boolean {
  const asRecord = args.reduce((acc, c) => acc + c.toString(), '');

  if (record[asRecord]) {
    return false;
  } else {
    record[asRecord] = true;
    return true;
  }
}

function consoleCommonBehavior(consoleFunc: (...args: SnSafeAny) => void, ...args: SnSafeAny[]): void {
  if (environment.isTestMode || (isDevMode() && notRecorded(...args))) {
    consoleFunc(...args);
  }
}

// Warning should only be printed in dev mode and only once.
export const warn = (...args: SnSafeAny[]): void =>
  consoleCommonBehavior((...arg: SnSafeAny[]) => console.warn(PREFIX, ...arg), ...args);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const warnDeprecation = (...args: SnSafeAny[]) => {
  if (!environment.isTestMode) {
    const stack = new Error().stack;
    return consoleCommonBehavior((...arg: SnSafeAny[]) => console.warn(PREFIX, 'deprecated:', ...arg, stack), ...args);
  } else {
    return () => {};
  }
};

// Log should only be printed in dev mode.
export const log = (...args: SnSafeAny[]): void => {
  if (isDevMode()) {
    console.log(PREFIX, ...args);
  }
};
