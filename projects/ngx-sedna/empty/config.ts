import { InjectionToken, TemplateRef, Type } from '@angular/core';

import { SnSafeAny } from 'ngx-sedna/core/types';

export type SnEmptySize = 'normal' | 'small' | '';

export type SnEmptyCustomContent = Type<SnSafeAny> | TemplateRef<SnSafeAny> | string | null;

export const SN_EMPTY_COMPONENT_NAME = new InjectionToken<string>('sn-empty-component-name');
