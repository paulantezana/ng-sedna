

import { InjectionToken } from '@angular/core';

import { WeekDayIndex } from 'ngx-sedna/core/time';

export interface NzDateConfig {
  /** Customize the first day of a week */
  firstDayOfWeek?: WeekDayIndex;
}

export const NZ_DATE_CONFIG = new InjectionToken<NzDateConfig>('date-config');

export const NZ_DATE_CONFIG_DEFAULT: NzDateConfig = {
  firstDayOfWeek: undefined
};

export function mergeDateConfig(config: NzDateConfig | null): NzDateConfig {
  return { ...NZ_DATE_CONFIG_DEFAULT, ...config };
}
