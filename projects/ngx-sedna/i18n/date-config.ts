

import { InjectionToken } from '@angular/core';

import { WeekDayIndex } from 'ngx-sedna/core/time';

export interface SnDateConfig {
  /** Customize the first day of a week */
  firstDayOfWeek?: WeekDayIndex;
}

export const SN_DATE_CONFIG = new InjectionToken<SnDateConfig>('date-config');

export const SN_DATE_CONFIG_DEFAULT: SnDateConfig = {
  firstDayOfWeek: undefined
};

export function mergeDateConfig(config: SnDateConfig | null): SnDateConfig {
  return { ...SN_DATE_CONFIG_DEFAULT, ...config };
}
