

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  Optional,
  SkipSelf,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ThemeType } from '@ant-design/icons-angular';

import { SnOutletModule } from 'ngx-sedna/core/outlet';
import { BooleanInput, SnTSType } from 'ngx-sedna/core/types';
import { InputBoolean, toBoolean } from 'ngx-sedna/core/util';
import { SnIconModule } from 'ngx-sedna/icon';
import { SnTooltipDirective } from 'ngx-sedna/tooltip';

import { DefaultTooltipIcon, SnFormDirective, SnLabelAlignType } from './form.directive';

export interface SnFormTooltipIcon {
  type: SnTSType;
  theme: ThemeType;
}

function toTooltipIcon(value: string | SnFormTooltipIcon): Required<SnFormTooltipIcon> {
  const icon = typeof value === 'string' ? { type: value } : value;
  return { ...DefaultTooltipIcon, ...icon };
}

@Component({
  selector: 'sn-form-label',
  exportAs: 'snFormLabel',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label [attr.for]="snFor" [class.ant-form-item-no-colon]="snNoColon" [class.ant-form-item-required]="snRequired">
      <ng-content></ng-content>
      @if (snTooltipTitle) {
        <span class="ant-form-item-tooltip" sn-tooltip [snTooltipTitle]="snTooltipTitle">
          <ng-container *snStringTemplateOutlet="tooltipIcon.type; let tooltipIconType">
            <span sn-icon [snType]="tooltipIconType" [snTheme]="tooltipIcon.theme"></span>
          </ng-container>
        </span>
      }
    </label>
  `,
  host: {
    class: 'ant-form-item-label',
    '[class.ant-form-item-label-left]': `snLabelAlign === 'left'`,
    '[class.ant-form-item-label-wrap]': `snLabelWrap`
  },
  imports: [SnOutletModule, SnTooltipDirective, SnIconModule],
  standalone: true
})
export class SnFormLabelComponent implements OnDestroy {
  static ngAcceptInputType_snRequired: BooleanInput;
  static ngAcceptInputType_snNoColon: BooleanInput;
  static ngAcceptInputType_snLabelWrap: BooleanInput;

  @Input() snFor?: string;
  @Input() @InputBoolean() snRequired = false;
  @Input()
  set snNoColon(value: boolean) {
    this.noColon = toBoolean(value);
  }
  get snNoColon(): boolean {
    return this.noColon !== 'default' ? this.noColon : this.snFormDirective?.snNoColon;
  }

  private noColon: boolean | 'default' = 'default';

  @Input() snTooltipTitle?: SnTSType;
  @Input()
  set snTooltipIcon(value: string | SnFormTooltipIcon) {
    this._tooltipIcon = toTooltipIcon(value);
  }
  // due to 'get' and 'set' accessor must have the same type, so it was renamed to `tooltipIcon`
  get tooltipIcon(): SnFormTooltipIcon {
    return this._tooltipIcon !== 'default'
      ? this._tooltipIcon
      : toTooltipIcon(this.snFormDirective?.snTooltipIcon || DefaultTooltipIcon);
  }
  private _tooltipIcon: SnFormTooltipIcon | 'default' = 'default';

  @Input()
  set snLabelAlign(value: SnLabelAlignType) {
    this.labelAlign = value;
  }

  get snLabelAlign(): SnLabelAlignType {
    return this.labelAlign !== 'default' ? this.labelAlign : this.snFormDirective?.snLabelAlign || 'right';
  }

  private labelAlign: SnLabelAlignType | 'default' = 'default';

  @Input()
  set snLabelWrap(value: boolean) {
    this.labelWrap = toBoolean(value);
  }

  get snLabelWrap(): boolean {
    return this.labelWrap !== 'default' ? this.labelWrap : this.snFormDirective?.snLabelWrap;
  }

  private labelWrap: boolean | 'default' = 'default';

  private destroy$ = new Subject<boolean>();

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() @SkipSelf() private snFormDirective: SnFormDirective
  ) {
    if (this.snFormDirective) {
      this.snFormDirective
        .getInputObservable('snNoColon')
        .pipe(
          filter(() => this.noColon === 'default'),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.cdr.markForCheck());

      this.snFormDirective
        .getInputObservable('snTooltipIcon')
        .pipe(
          filter(() => this._tooltipIcon === 'default'),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.cdr.markForCheck());

      this.snFormDirective
        .getInputObservable('snLabelAlign')
        .pipe(
          filter(() => this.labelAlign === 'default'),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.cdr.markForCheck());

      this.snFormDirective
        .getInputObservable('snLabelWrap')
        .pipe(
          filter(() => this.labelWrap === 'default'),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.cdr.markForCheck());
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
