



import { InjectionToken, TemplateRef, Type } from '@angular/core';

import { SnSafeAny } from 'ngx-sedna/core/types';

export type NzEmptySize = 'normal' | 'small' | '';

export type NzEmptyCustomContent = Type<SnSafeAny> | TemplateRef<SnSafeAny> | string | null;

export const NZ_EMPTY_COMPONENT_NAME = new InjectionToken<string>('nz-empty-component-name');
