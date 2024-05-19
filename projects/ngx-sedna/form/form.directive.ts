

import { Direction, Directionality } from '@angular/cdk/bidi';
import { Directive, Input, OnChanges, OnDestroy, Optional, SimpleChange, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { ThemeType } from '@ant-design/icons-angular';

import { SnConfigKey, SnConfigService, WithConfig } from 'ngx-sedna/core/config';
import { BooleanInput, InputObservable } from 'ngx-sedna/core/types';
import { InputBoolean } from 'ngx-sedna/core/util';

const SN_CONFIG_MODULE_NAME: SnConfigKey = 'form';

export type SnFormLayoutType = 'horizontal' | 'vertical' | 'inline';

export type SnLabelAlignType = 'left' | 'right';

export const DefaultTooltipIcon = {
  type: 'question-circle',
  theme: 'outline'
} as const;

@Directive({
  selector: '[sn-form]',
  exportAs: 'snForm',
  host: {
    class: 'ant-form',
    '[class.ant-form-horizontal]': `snLayout === 'horizontal'`,
    '[class.ant-form-vertical]': `snLayout === 'vertical'`,
    '[class.ant-form-inline]': `snLayout === 'inline'`,
    '[class.ant-form-rtl]': `dir === 'rtl'`
  },
  standalone: true
})
export class SnFormDirective implements OnChanges, OnDestroy, InputObservable {
  readonly _snModuleName: SnConfigKey = SN_CONFIG_MODULE_NAME;
  static ngAcceptInputType_snNoColon: BooleanInput;
  static ngAcceptInputType_snDisableAutoTips: BooleanInput;
  static ngAcceptInputType_snLabelWrap: BooleanInput;

  @Input() snLayout: SnFormLayoutType = 'horizontal';
  @Input() @WithConfig() @InputBoolean() snNoColon: boolean = false;
  @Input() @WithConfig() snAutoTips: Record<string, Record<string, string>> = {};
  @Input() @InputBoolean() snDisableAutoTips = false;
  @Input() @WithConfig() snTooltipIcon: string | { type: string; theme: ThemeType } = DefaultTooltipIcon;
  @Input() snLabelAlign: SnLabelAlignType = 'right';
  @Input() @WithConfig() @InputBoolean() snLabelWrap: boolean = false;

  dir: Direction = 'ltr';
  destroy$ = new Subject<boolean>();
  private inputChanges$ = new Subject<SimpleChanges>();

  getInputObservable<K extends keyof this>(changeType: K): Observable<SimpleChange> {
    return this.inputChanges$.pipe(
      filter(changes => changeType in changes),
      map(value => value[changeType as string])
    );
  }

  constructor(
    public snConfigService: SnConfigService,
    @Optional() private directionality: Directionality
  ) {
    this.dir = this.directionality.value;
    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.inputChanges$.next(changes);
  }

  ngOnDestroy(): void {
    this.inputChanges$.complete();
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
