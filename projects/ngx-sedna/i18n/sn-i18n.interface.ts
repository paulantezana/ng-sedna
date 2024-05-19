

import { Locale } from 'date-fns';

export interface SnPaginationI18nInterface {
  items_per_page: string;
  jump_to: string;
  jump_to_confirm: string;
  page: string;

  // Pagination.jsx
  prev_page: string;
  next_page: string;
  prev_5: string;
  next_5: string;
  prev_3: string;
  next_3: string;
}

export interface SnGlobalI18nInterface {
  placeholder: string;
}

export interface SnDatePickerI18nInterface {
  lang: SnDatePickerLangI18nInterface;
  timePickerLocale: SnTimePickerI18nInterface;
}

export interface SnCalendarI18nInterface {
  today: string;
  now: string;
  backToToday: string;
  ok: string;
  clear: string;
  month: string;
  year: string;
  timeSelect: string;
  dateSelect: string;
  monthSelect: string;
  yearSelect: string;
  decadeSelect: string;
  yearFormat: string;
  monthFormat?: string;
  dateFormat: string;
  dayFormat: string;
  dateTimeFormat: string;
  monthBeforeYear?: boolean;
  previousMonth: string;
  nextMonth: string;
  previousYear: string;
  nextYear: string;
  previousDecade: string;
  nextDecade: string;
  previousCentury: string;
  nextCentury: string;
}

export interface SnDatePickerLangI18nInterface extends SnCalendarI18nInterface {
  placeholder?: string;
  yearPlaceholder?: string;
  quarterPlaceholder?: string;
  monthPlaceholder?: string;
  weekPlaceholder?: string;
  rangePlaceholder?: string[];
  rangeYearPlaceholder?: string[];
  rangeMonthPlaceholder?: string[];
  rangeWeekPlaceholder?: string[];
}

export interface SnTimePickerI18nInterface {
  placeholder?: string;
  rangePlaceholder?: string[];
}

export type ValidateMessage = string | (() => string);

export type NzCascaderI18nInterface = SnGlobalI18nInterface;

export interface SnTableI18nInterface {
  filterTitle?: string;
  filterConfirm?: string;
  filterReset?: string;
  selectAll?: string;
  selectInvert?: string;
  selectionAll?: string;
  sortTitle?: string;
  expand?: string;
  collapse?: string;
  triggerDesc?: string;
  triggerAsc?: string;
  cancelSort?: string;
}

export interface SnModalI18nInterface {
  okText: string;
  cancelText: string;
  justOkText: string;
}

export interface SnPopconfirmI18nInterface {
  okText: string;
  cancelText: string;
}

export interface SnTransferI18nInterface {
  titles?: string[];
  searchPlaceholder?: string;
  itemUnit?: string;
  itemsUnit?: string;
}

export interface SnUploadI18nInterface {
  uploading?: string;
  removeFile?: string;
  uploadError?: string;
  previewFile?: string;
  downloadFile?: string;
}

export interface SnEmptyI18nInterface {
  description: string;
}

export interface SnTextI18nInterface {
  edit: string;
  copy: string;
  copied: string;
  expand: string;
}

export interface NzCronExpressionLabelI18n {
  second?: string;
  minute?: string;
  hour?: string;
  day?: string;
  month?: string;
  week?: string;
}

export interface NzCronExpressionCronErrorI18n {
  cronError?: string;
}

export type NzCronExpressionI18nInterface = NzCronExpressionCronErrorI18n & NzCronExpressionLabelI18n;

export interface NzQRCodeI18nInterface {
  expired: string;
  refresh: string;
}

export interface SnI18nInterface {
  locale: string;
  Pagination: SnPaginationI18nInterface;
  DatePicker: SnDatePickerI18nInterface;
  TimePicker: SnTimePickerI18nInterface;
  Calendar: SnDatePickerI18nInterface;
  global?: SnGlobalI18nInterface;
  Table: SnTableI18nInterface;
  Modal: SnModalI18nInterface;
  Popconfirm: SnPopconfirmI18nInterface;
  Transfer: SnTransferI18nInterface;
  Upload: SnUploadI18nInterface;
  Empty: SnEmptyI18nInterface;
  Text?: SnTextI18nInterface;
  CronExpression?: NzCronExpressionI18nInterface;
  QRCode?: NzQRCodeI18nInterface;
}

export type DateLocale = Locale;
