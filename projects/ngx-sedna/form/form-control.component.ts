

import { NgClass } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Host,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { AbstractControl, FormControlDirective, FormControlName, NgControl, NgModel } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, startWith, takeUntil, tap } from 'rxjs/operators';

import { helpMotion } from 'ngx-sedna/core/animation';
import { SnFormStatusService } from 'ngx-sedna/core/form';
import { SnOutletModule } from 'ngx-sedna/core/outlet';
import { BooleanInput, SnSafeAny } from 'ngx-sedna/core/types';
import { toBoolean } from 'ngx-sedna/core/util';
import { SnI18nService } from 'ngx-sedna/i18n';

import { SnFormControlStatusType, SnFormItemComponent } from './form-item.component';
import { SnFormDirective } from './form.directive';

@Component({
  selector: 'sn-form-control',
  exportAs: 'snFormControl',
  preserveWhitespaces: false,
  animations: [helpMotion],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="ant-form-item-control-input">
      <div class="ant-form-item-control-input-content">
        <ng-content></ng-content>
      </div>
    </div>
    @if (innerTip) {
      <div @helpMotion class="ant-form-item-explain ant-form-item-explain-connected">
        <div role="alert" [ngClass]="['ant-form-item-explain-' + status]">
          <ng-container *snStringTemplateOutlet="innerTip; context: { $implicit: validateControl }">{{
            innerTip
          }}</ng-container>
        </div>
      </div>
    }

    @if (snExtra) {
      <div class="ant-form-item-extra">
        <ng-container *snStringTemplateOutlet="snExtra">{{ snExtra }}</ng-container>
      </div>
    }
  `,
  providers: [SnFormStatusService],
  host: {
    class: 'ant-form-item-control'
  },
  imports: [NgClass, SnOutletModule],
  standalone: true
})
export class SnFormControlComponent implements OnChanges, OnDestroy, OnInit, AfterContentInit, OnDestroy {
  static ngAcceptInputType_snHasFeedback: BooleanInput;
  static ngAcceptInputType_snRequired: BooleanInput;
  static ngAcceptInputType_snNoColon: BooleanInput;
  static ngAcceptInputType_snDisableAutoTips: BooleanInput;

  private _hasFeedback = false;
  private validateChanges: Subscription = Subscription.EMPTY;
  private validateString: string | null = null;
  private destroyed$ = new Subject<void>();
  private localeId!: string;
  private autoErrorTip?: string;

  private get disableAutoTips(): boolean {
    return this.snDisableAutoTips !== 'default'
      ? toBoolean(this.snDisableAutoTips)
      : this.snFormDirective?.snDisableAutoTips;
  }

  status: SnFormControlStatusType = '';
  validateControl: AbstractControl | NgModel | null = null;
  innerTip: string | TemplateRef<{ $implicit: AbstractControl | NgModel }> | null = null;

  @ContentChild(NgControl, { static: false }) defaultValidateControl?: FormControlName | FormControlDirective;
  @Input() snSuccessTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() snWarningTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() snErrorTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() snValidatingTip?: string | TemplateRef<{ $implicit: AbstractControl | NgModel }>;
  @Input() snExtra?: string | TemplateRef<void>;
  @Input() snAutoTips: Record<string, Record<string, string>> = {};
  @Input() snDisableAutoTips: boolean | 'default' = 'default';

  @Input()
  set snHasFeedback(value: boolean) {
    this._hasFeedback = toBoolean(value);
    this.snFormStatusService.formStatusChanges.next({ status: this.status, hasFeedback: this._hasFeedback });
    if (this.snFormItemComponent) {
      this.snFormItemComponent.setHasFeedback(this._hasFeedback);
    }
  }

  get snHasFeedback(): boolean {
    return this._hasFeedback;
  }

  @Input()
  set snValidateStatus(value: string | AbstractControl | FormControlName | NgModel) {
    if (value instanceof AbstractControl || value instanceof NgModel) {
      this.validateControl = value;
      this.validateString = null;
      this.watchControl();
    } else if (value instanceof FormControlName) {
      this.validateControl = value.control;
      this.validateString = null;
      this.watchControl();
    } else {
      this.validateString = value;
      this.validateControl = null;
      this.setStatus();
    }
  }

  private watchControl(): void {
    this.validateChanges.unsubscribe();
    /** miss detect https://github.com/angular/angular/issues/10887 **/
    if (this.validateControl && this.validateControl.statusChanges) {
      this.validateChanges = (this.validateControl.statusChanges as Observable<SnSafeAny>)
        .pipe(startWith(null), takeUntil(this.destroyed$))
        .subscribe(() => {
          if (!this.disableAutoTips) {
            this.updateAutoErrorTip();
          }
          this.setStatus();
          this.cdr.markForCheck();
        });
    }
  }

  private setStatus(): void {
    this.status = this.getControlStatus(this.validateString);
    this.innerTip = this.getInnerTip(this.status);
    this.snFormStatusService.formStatusChanges.next({ status: this.status, hasFeedback: this.snHasFeedback });
    if (this.snFormItemComponent) {
      this.snFormItemComponent.setWithHelpViaTips(!!this.innerTip);
      this.snFormItemComponent.setStatus(this.status);
    }
  }

  private getControlStatus(validateString: string | null): SnFormControlStatusType {
    let status: SnFormControlStatusType;

    if (validateString === 'warning' || this.validateControlStatus('INVALID', 'warning')) {
      status = 'warning';
    } else if (validateString === 'error' || this.validateControlStatus('INVALID')) {
      status = 'error';
    } else if (
      validateString === 'validating' ||
      validateString === 'pending' ||
      this.validateControlStatus('PENDING')
    ) {
      status = 'validating';
    } else if (validateString === 'success' || this.validateControlStatus('VALID')) {
      status = 'success';
    } else {
      status = '';
    }

    return status;
  }

  private validateControlStatus(validStatus: string, statusType?: SnFormControlStatusType): boolean {
    if (!this.validateControl) {
      return false;
    } else {
      const { dirty, touched, status } = this.validateControl;
      return (
        (!!dirty || !!touched) && (statusType ? this.validateControl.hasError(statusType) : status === validStatus)
      );
    }
  }

  private getInnerTip(
    status: SnFormControlStatusType
  ): string | TemplateRef<{ $implicit: AbstractControl | NgModel }> | null {
    switch (status) {
      case 'error':
        return (!this.disableAutoTips && this.autoErrorTip) || this.snErrorTip || null;
      case 'validating':
        return this.snValidatingTip || null;
      case 'success':
        return this.snSuccessTip || null;
      case 'warning':
        return this.snWarningTip || null;
      default:
        return null;
    }
  }

  private updateAutoErrorTip(): void {
    if (this.validateControl) {
      const errors = this.validateControl.errors || {};
      let autoErrorTip = '';
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          autoErrorTip =
            errors[key]?.[this.localeId] ??
            this.snAutoTips?.[this.localeId]?.[key] ??
            this.snAutoTips.default?.[key] ??
            this.snFormDirective?.snAutoTips?.[this.localeId]?.[key] ??
            this.snFormDirective?.snAutoTips.default?.[key];
        }
        if (!!autoErrorTip) {
          break;
        }
      }
      this.autoErrorTip = autoErrorTip;
    }
  }

  private subscribeAutoTips(observable: Observable<SnSafeAny>): void {
    observable?.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      if (!this.disableAutoTips) {
        this.updateAutoErrorTip();
        this.setStatus();
        this.cdr.markForCheck();
      }
    });
  }

  constructor(
    @Optional() @Host() private snFormItemComponent: SnFormItemComponent,
    private cdr: ChangeDetectorRef,
    i18n: SnI18nService,
    @Optional() private snFormDirective: SnFormDirective,
    private snFormStatusService: SnFormStatusService
  ) {
    this.subscribeAutoTips(i18n.localeChange.pipe(tap(locale => (this.localeId = locale.locale))));
    this.subscribeAutoTips(this.snFormDirective?.getInputObservable('snAutoTips'));
    this.subscribeAutoTips(
      this.snFormDirective
        ?.getInputObservable('snDisableAutoTips')
        .pipe(filter(() => this.snDisableAutoTips === 'default'))
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { snDisableAutoTips, snAutoTips, snSuccessTip, snWarningTip, snErrorTip, snValidatingTip } = changes;

    if (snDisableAutoTips || snAutoTips) {
      this.updateAutoErrorTip();
      this.setStatus();
    } else if (snSuccessTip || snWarningTip || snErrorTip || snValidatingTip) {
      this.setStatus();
    }
  }

  ngOnInit(): void {
    this.setStatus();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngAfterContentInit(): void {
    if (!this.validateControl && !this.validateString) {
      if (this.defaultValidateControl instanceof FormControlDirective) {
        this.snValidateStatus = this.defaultValidateControl.control;
      } else {
        this.snValidateStatus = this.defaultValidateControl!;
      }
    }
  }
}
