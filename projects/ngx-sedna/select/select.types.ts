

import { TemplateRef } from '@angular/core';

import { SnSafeAny } from 'ngx-sedna/core/types';

export type NzSelectModeType = 'default' | 'multiple' | 'tags';
export interface NzSelectItemInterface {
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

export interface NzSelectOptionInterface {
  label: string | number | null | TemplateRef<SnSafeAny>;
  value: SnSafeAny | null;
  title?: string | number | null;
  disabled?: boolean;
  hide?: boolean;
  groupLabel?: string | number | TemplateRef<SnSafeAny> | null;
  key?: string | number;
}

export type NzSelectTopControlItemType = Partial<NzSelectItemInterface> & {
  contentTemplateOutlet: TemplateRef<SnSafeAny> | null;
  contentTemplateOutletContext: SnSafeAny;
};

export type NzFilterOptionType = (input: string, option: NzSelectItemInterface) => boolean;

export type NzSelectPlacementType = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
