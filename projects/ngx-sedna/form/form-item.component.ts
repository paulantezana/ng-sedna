

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

export type SnFormControlStatusType = 'success' | 'error' | 'warning' | 'validating' | '';

/** should add sn-row directive to host, track https://github.com/angular/angular/issues/8785 **/
@Component({
  selector: 'sn-form-item',
  exportAs: 'snFormItem',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ant-form-item',
    '[class.ant-form-item-has-success]': 'status === "success"',
    '[class.ant-form-item-has-warning]': 'status === "warning"',
    '[class.ant-form-item-has-error]': 'status === "error"',
    '[class.ant-form-item-is-validating]': 'status === "validating"',
    '[class.ant-form-item-has-feedback]': 'hasFeedback && status',
    '[class.ant-form-item-with-help]': 'withHelpClass'
  },
  template: ` <ng-content></ng-content> `,
  standalone: true
})
export class SnFormItemComponent implements OnDestroy, OnDestroy {
  status: SnFormControlStatusType = '';
  hasFeedback = false;
  withHelpClass = false;

  private destroy$ = new Subject<boolean>();

  setWithHelpViaTips(value: boolean): void {
    this.withHelpClass = value;
    this.cdr.markForCheck();
  }

  setStatus(status: SnFormControlStatusType): void {
    this.status = status;
    this.cdr.markForCheck();
  }

  setHasFeedback(hasFeedback: boolean): void {
    this.hasFeedback = hasFeedback;
    this.cdr.markForCheck();
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
