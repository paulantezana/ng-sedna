import { Direction } from '@angular/cdk/bidi';
import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, TemplateRef, Type } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';

import { ThemeType } from '@ant-design/icons-angular';

import { SnBreakpointEnum } from 'ngx-sedna/core/services';
import {
  SnSafeAny,
  SnShapeSCType,
  SnSizeDSType,
  SnSizeLDSType,
  SnSizeMDSType,
  SnTSType
} from 'ngx-sedna/core/types';

interface MonacoEnvironment {
  globalAPI?: boolean;
  baseUrl?: string;
  getWorker?(workerId: string, label: string): Promise<Worker> | Worker;
  getWorkerUrl?(workerId: string, label: string): string;
}

export interface SnConfig {
  affix?: AffixConfig;
  select?: SelectConfig;
  alert?: AlertConfig;
  anchor?: AnchorConfig;
  avatar?: AvatarConfig;
  backTop?: BackTopConfig;
  badge?: BadgeConfig;
  button?: ButtonConfig;
  card?: CardConfig;
  carousel?: CarouselConfig;
  cascader?: CascaderConfig;
  codeEditor?: CodeEditorConfig;
  collapse?: CollapseConfig;
  collapsePanel?: CollapsePanelConfig;
  datePicker?: DatePickerConfig;
  descriptions?: DescriptionsConfig;
  drawer?: DrawerConfig;
  dropDown?: DropDownConfig;
  empty?: EmptyConfig;
  filterTrigger?: FilterTriggerConfig;
  form?: FormConfig;
  icon?: IconConfig;
  message?: MessageConfig;
  modal?: ModalConfig;
  notification?: NotificationConfig;
  pageHeader?: PageHeaderConfig;
  pagination?: PaginationConfig;
  progress?: ProgressConfig;
  rate?: RateConfig;
  segmented?: SegmentedConfig;
  space?: SpaceConfig;
  spin?: SpinConfig;
  switch?: SwitchConfig;
  table?: TableConfig;
  tabs?: TabsConfig;
  timePicker?: TimePickerConfig;
  tree?: TreeConfig;
  treeSelect?: TreeSelectConfig;
  typography?: TypographyConfig;
  image?: ImageConfig;
  popconfirm?: PopConfirmConfig;
  popover?: PopoverConfig;
  imageExperimental?: ImageExperimentalConfig;
  theme?: Theme;
  prefixCls?: PrefixCls;
}

export interface PrefixCls {
  prefixCls?: string;
  iconPrefixCls?: string;
}

export interface Theme {
  primaryColor?: string;
  infoColor?: string;
  successColor?: string;
  processingColor?: string;
  errorColor?: string;
  warningColor?: string;
  [key: string]: string | undefined;
}

export interface SelectConfig {
  snBorderless?: boolean;
  snSuffixIcon?: TemplateRef<SnSafeAny> | string | null;
  snBackdrop?: boolean;
  snOptionHeightPx?: number;
}

export interface AffixConfig {
  snOffsetBottom?: number;
  snOffsetTop?: number;
}

export interface AlertConfig {
  snCloseable?: boolean;
  snShowIcon?: boolean;
}

export interface AvatarConfig {
  snShape?: SnShapeSCType;
  snSize?: SnSizeLDSType | number;
  snGap?: number;
}

export interface AnchorConfig {
  snBounds?: number;
  snOffsetBottom?: number;
  snOffsetTop?: number;
  snShowInkInFixed?: boolean;
}

export interface BackTopConfig {
  snVisibilityHeight?: number;
}

export interface BadgeConfig {
  snColor?: number;
  snOverflowCount?: number;
  snShowZero?: number;
}

export interface ButtonConfig {
  snSize?: 'large' | 'default' | 'small';
}

export interface CodeEditorConfig {
  assetsRoot?: string | SafeUrl;
  extraConfig?: SnSafeAny;
  defaultEditorOption?: SnSafeAny;
  useStaticLoading?: boolean;
  monacoEnvironment?: MonacoEnvironment;

  onLoad?(): void;

  onFirstEditorInit?(): void;

  onInit?(): void;
}

export interface CardConfig {
  snSize?: SnSizeDSType;
  snHoverable?: boolean;
  snBordered?: boolean;
  snBorderless?: boolean;
}

export interface CarouselConfig {
  snAutoPlay?: boolean;
  snAutoPlaySpeed?: boolean;
  snDots?: boolean;
  snEffect?: 'scrollx' | 'fade' | string;
  snEnableSwipe?: boolean;
  snVertical?: boolean;
  snLoop?: boolean;
}

export interface CascaderConfig {
  snSize?: string;
  snBackdrop?: boolean;
}

export interface CollapseConfig {
  snAccordion?: boolean;
  snBordered?: boolean;
  snGhost?: boolean;
}

export interface CollapsePanelConfig {
  snShowArrow?: boolean;
}

export interface DatePickerConfig {
  snSeparator?: string;
  snSuffixIcon?: string | TemplateRef<SnSafeAny>;
  snBackdrop?: boolean;
}

export interface DescriptionsConfig {
  snBordered?: boolean;
  snColumn?: { [key in SnBreakpointEnum]?: number } | number;
  snSize?: 'default' | 'middle' | 'small';
  snColon?: boolean;
}

export interface DrawerConfig {
  snMask?: boolean;
  snMaskClosable?: boolean;
  snCloseOnNavigation?: boolean;
  snDirection?: Direction;
}

export interface DropDownConfig {
  snBackdrop?: boolean;
}

export interface EmptyConfig {
  snDefaultEmptyContent?: Type<SnSafeAny> | TemplateRef<string> | string | undefined;
}

export interface FilterTriggerConfig {
  snBackdrop?: boolean;
}

export interface FormConfig {
  snNoColon?: boolean;
  snAutoTips?: Record<string, Record<string, string>>;
  snTooltipIcon?: string | { type: string; theme: ThemeType };
}

export interface IconConfig {
  snTheme?: 'fill' | 'outline' | 'twotone';
  snTwotoneColor?: string;
}

export interface MessageConfig {
  snAnimate?: boolean;
  snDuration?: number;
  snMaxStack?: number;
  snPauseOnHover?: boolean;
  snTop?: number | string;
  snDirection?: Direction;
}

export interface ModalConfig {
  snMask?: boolean;
  snMaskClosable?: boolean;
  snCloseOnNavigation?: boolean;
  snDirection?: Direction;
}

export interface NotificationConfig extends MessageConfig {
  snTop?: string | number;
  snBottom?: string | number;
  snPlacement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'top' | 'bottom';
}

export interface PageHeaderConfig {
  snGhost: boolean;
}

export interface PaginationConfig {
  snSize?: 'default' | 'small';
  snPageSizeOptions?: number[];
  snShowSizeChanger?: boolean;
  snShowQuickJumper?: boolean;
  snSimple?: boolean;
}

export interface ProgressConfig {
  snGapDegree?: number;
  snGapPosition?: 'top' | 'right' | 'bottom' | 'left';
  snShowInfo?: boolean;
  snStrokeSwitch?: number;
  snStrokeWidth?: number;
  snSize?: 'default' | 'small';
  snStrokeLinecap?: 'round' | 'square';
  snStrokeColor?: string;
}

export interface RateConfig {
  snAllowClear?: boolean;
  snAllowHalf?: boolean;
}

export interface SegmentedConfig {
  snSize?: SnSizeLDSType;
}

export interface SpaceConfig {
  snSize?: 'small' | 'middle' | 'large' | number;
}

export interface SpinConfig {
  snIndicator?: TemplateRef<SnSafeAny>;
}

export interface SwitchConfig {
  snSize: SnSizeDSType;
}

export interface TableConfig {
  snBordered?: boolean;
  snSize?: SnSizeMDSType;
  snShowQuickJumper?: boolean;
  snLoadingIndicator?: TemplateRef<SnSafeAny>;
  snShowSizeChanger?: boolean;
  snSimple?: boolean;
  snHideOnSinglePage?: boolean;
}

export interface TabsConfig {
  snAnimated?:
    | boolean
    | {
        inkBar: boolean;
        tabPane: boolean;
      };
  snSize?: SnSizeLDSType;
  snType?: 'line' | 'card';
  snTabBarGutter?: number;
  snShowPagination?: boolean;
}

export interface TimePickerConfig {
  snAllowEmpty?: boolean;
  snClearText?: string;
  snNowText?: string;
  snOkText?: string;
  snFormat?: string;
  snHourStep?: number;
  snMinuteStep?: number;
  snSecondStep?: number;
  snPopupClassName?: string;
  snUse12Hours?: string;
  snSuffixIcon?: string | TemplateRef<SnSafeAny>;
  snBackdrop?: boolean;
}

export interface TreeConfig {
  snBlockNode?: boolean;
  snShowIcon?: boolean;
  snHideUnMatched?: boolean;
}

export interface TreeSelectConfig {
  snShowIcon?: string;
  snShowLine?: boolean;
  snDropdownMatchSelectWidth?: boolean;
  snHideUnMatched?: boolean;
  snSize?: 'large' | 'small' | 'default';
  snBackdrop?: boolean;
}

export interface TypographyConfig {
  snEllipsisRows?: number;
  snCopyTooltips?: [SnTSType, SnTSType] | null;
  snCopyIcons: [SnTSType, SnTSType];
  snEditTooltip?: null | SnTSType;
  snEditIcon: SnTSType;
}

export interface ImageConfig {
  snFallback?: string;
  snPlaceholder?: string;
  snDisablePreview?: string;
  snCloseOnNavigation?: boolean;
  snDirection?: Direction;
  snScaleStep?: number;
}

export interface ImageExperimentalConfig {
  snFallback?: string;
  snPlaceholder?: string;
  snDisablePreview?: string;
  snCloseOnNavigation?: boolean;
  snDirection?: Direction;
  snAutoSrcset?: boolean;
  snSrcLoader?(params: { src: string; width: number }): string;
}

export interface PopConfirmConfig {
  snPopconfirmBackdrop?: boolean;
  snAutofocus?: null | 'ok' | 'cancel';
}

export interface PopoverConfig {
  snPopoverBackdrop?: boolean;
}

export type SnConfigKey = keyof SnConfig;

/**
 * User should provide an object implements this interface to set global configurations.
 */
export const SN_CONFIG = new InjectionToken<SnConfig>('sn-config');

export function provideSnConfig(config: SnConfig): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: SN_CONFIG, useValue: config }]);
}
