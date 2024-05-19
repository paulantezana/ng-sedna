

import { Direction, Directionality } from '@angular/cdk/bidi';
import { Directive, Input, OnChanges, OnDestroy, Optional, SimpleChange, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { ThemeType } from '@ant-design/icons-angular';

import { SnConfigKey, SnConfigService, WithConfig } from 'ngx-sedna/core/config';
import { BooleanInput, InputObservable } from 'ngx-sedna/core/types';
import { InputBoolean } from 'ngx-sedna/core/util';

const NZ_CONFIG_MODULE_NAME: SnConfigKey = 'form';

export type NzFormLayoutType = 'horizontal' | 'vertical' | 'inline';

export type NzLabelAlignType = 'left' | 'right';

export const DefaultTooltipIcon = {
  type: 'question-circle',
  theme: 'outline'
} as const;

@Directive({
  selector: '[nz-form]',
  exportAs: 'nzForm',
  host: {
    class: 'ant-form',
    '[class.ant-form-horizontal]': `nzLayout === 'horizontal'`,
    '[class.ant-form-vertical]': `nzLayout === 'vertical'`,
    '[class.ant-form-inline]': `nzLayout === 'inline'`,
    '[class.ant-form-rtl]': `dir === 'rtl'`
  },
  standalone: true
})
export class NzFormDirective implements OnChanges, OnDestroy, InputObservable {
  readonly _nzModuleName: SnConfigKey = NZ_CONFIG_MODULE_NAME;
  static ngAcceptInputType_nzNoColon: BooleanInput;
  static ngAcceptInputType_nzDisableAutoTips: BooleanInput;
  static ngAcceptInputType_nzLabelWrap: BooleanInput;

  @Input() nzLayout: NzFormLayoutType = 'horizontal';
  @Input() @WithConfig() @InputBoolean() nzNoColon: boolean = false;
  @Input() @WithConfig() nzAutoTips: Record<string, Record<string, string>> = {};
  @Input() @InputBoolean() nzDisableAutoTips = false;
  @Input() @WithConfig() nzTooltipIcon: string | { type: string; theme: ThemeType } = DefaultTooltipIcon;
  @Input() nzLabelAlign: NzLabelAlignType = 'right';
  @Input() @WithConfig() @InputBoolean() nzLabelWrap: boolean = false;

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
    public nzConfigService: SnConfigService,
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
