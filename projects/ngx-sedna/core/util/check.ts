import { TemplateRef } from '@angular/core';

import { IndexableObject, SnSafeAny } from 'ngx-sedna/core/types';

export function isNotNil<T>(value: T): value is NonNullable<T> {
  return typeof value !== 'undefined' && value !== null;
}

export function isNil(value: unknown): value is null | undefined {
  return typeof value === 'undefined' || value === null;
}

/**
 * Examine if two objects are shallowly equaled.
 */
export function shallowEqual(objA?: IndexableObject, objB?: IndexableObject): boolean {
  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || !objA || typeof objB !== 'object' || !objB) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx];
    if (!bHasOwnProperty(key)) {
      return false;
    }
    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
}

export function isNonEmptyString(value: SnSafeAny): boolean {
  return typeof value === 'string' && value !== '';
}

export function isTemplateRef(value: SnSafeAny): boolean {
  return value instanceof TemplateRef;
}
