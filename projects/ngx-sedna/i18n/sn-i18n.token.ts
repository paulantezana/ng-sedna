

import { InjectionToken, makeEnvironmentProviders, EnvironmentProviders } from '@angular/core';

import { DateLocale, SnI18nInterface } from './sn-i18n.interface';

export const SN_I18N = new InjectionToken<SnI18nInterface>('sn-i18n');

export function provideSnI18n(config: SnI18nInterface): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: SN_I18N, useValue: config }]);
}

/** Locale for date operations, should import from date-fns, see example: https://github.com/date-fns/date-fns/blob/v1.30.1/src/locale/zh_cn/index.js */
export const SN_DATE_LOCALE = new InjectionToken<DateLocale>('sn-date-locale');
