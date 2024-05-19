import { CSP_NONCE, Inject, Injectable, Optional } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';

import { SnSafeAny } from 'ngx-sedna/core/types';

import { SnConfig, SnConfigKey, NZ_CONFIG } from './config';
import { registerTheme } from './css-variables';

const isDefined = function (value?: SnSafeAny): boolean {
  return value !== undefined;
};

const defaultPrefixCls = 'ant';

@Injectable({
  providedIn: 'root'
})
export class SnConfigService {
  private configUpdated$ = new Subject<keyof SnConfig>();

  /** Global config holding property. */
  private readonly config: SnConfig;

  private readonly cspNonce?: string | null;

  constructor(
    @Optional() @Inject(NZ_CONFIG) defaultConfig?: SnConfig,
    @Optional() @Inject(CSP_NONCE) cspNonce?: string | null
  ) {
    this.config = defaultConfig || {};
    this.cspNonce = cspNonce;

    if (this.config.theme) {
      // If theme is set with NZ_CONFIG, register theme to make sure css variables work
      registerTheme(this.getConfig().prefixCls?.prefixCls || defaultPrefixCls, this.config.theme, cspNonce);
    }
  }

  getConfig(): SnConfig {
    return this.config;
  }

  getConfigForComponent<T extends SnConfigKey>(componentName: T): SnConfig[T] {
    return this.config[componentName];
  }

  getConfigChangeEventForComponent(componentName: SnConfigKey): Observable<void> {
    return this.configUpdated$.pipe(
      filter(n => n === componentName),
      mapTo(undefined)
    );
  }

  set<T extends SnConfigKey>(componentName: T, value: SnConfig[T]): void {
    this.config[componentName] = { ...this.config[componentName], ...value };
    if (componentName === 'theme' && this.config.theme) {
      registerTheme(this.getConfig().prefixCls?.prefixCls || defaultPrefixCls, this.config.theme, this.cspNonce);
    }
    this.configUpdated$.next(componentName);
  }
}

/* eslint-disable no-invalid-this */

/**
 * This decorator is used to decorate properties. If a property is decorated, it would try to load default value from
 * config.
 */
// eslint-disable-next-line
export function WithConfig<T>() {
  return function ConfigDecorator(
    target: SnSafeAny,
    propName: SnSafeAny,
    originalDescriptor?: TypedPropertyDescriptor<T>
  ): SnSafeAny {
    const privatePropName = `$$__zorroConfigDecorator__${propName}`;

    Object.defineProperty(target, privatePropName, {
      configurable: true,
      writable: true,
      enumerable: false
    });

    return {
      get(): T | undefined {
        const originalValue = originalDescriptor?.get ? originalDescriptor.get.bind(this)() : this[privatePropName];
        const assignedByUser = (this.propertyAssignCounter?.[propName] || 0) > 1;
        const configValue = this.nzConfigService.getConfigForComponent(this._nzModuleName)?.[propName];
        if (assignedByUser && isDefined(originalValue)) {
          return originalValue;
        } else {
          return isDefined(configValue) ? configValue : originalValue;
        }
      },
      set(value?: T): void {
        // If the value is assigned, we consider the newly assigned value as 'assigned by user'.
        this.propertyAssignCounter = this.propertyAssignCounter || {};
        this.propertyAssignCounter[propName] = (this.propertyAssignCounter[propName] || 0) + 1;

        if (originalDescriptor?.set) {
          originalDescriptor.set.bind(this)(value!);
        } else {
          this[privatePropName] = value;
        }
      },
      configurable: true,
      enumerable: true
    };
  };
}
