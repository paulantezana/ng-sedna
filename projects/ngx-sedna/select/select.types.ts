

import { TemplateRef } from '@angular/core';

import { SnSafeAny } from 'ngx-sedna/core/types';

export type SnSelectModeType = 'default' | 'multiple' | 'tags';
export interface SnSelectItemInterface {
  template?: TemplateRef<SnSafeAny> | null;
  nzLabel: string | number | null;
  nzValue: SnSafeAny | null;
  nzTitle?: string | number | null;
  nzDisabled?: boolean;
  nzHide?: boolean;
  nzCustomContent?: boolean;
  groupLabel?: string | number | TemplateRef<SnSafeAny> | null;
  type?: string;
  key?: SnSafeAny;
}

export interface SnSelectOptionInterface {
  label: string | number | null | TemplateRef<SnSafeAny>;
  value: SnSafeAny | null;
  title?: string | number | null;
  disabled?: boolean;
  hide?: boolean;
  groupLabel?: string | number | TemplateRef<SnSafeAny> | null;
  key?: string | number;
}

export type SnSelectTopControlItemType = Partial<SnSelectItemInterface> & {
  contentTemplateOutlet: TemplateRef<SnSafeAny> | null;
  contentTemplateOutletContext: SnSafeAny;
};

export type SnFilterOptionType = (input: string, option: SnSelectItemInterface) => boolean;

export type SnSelectPlacementType = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
