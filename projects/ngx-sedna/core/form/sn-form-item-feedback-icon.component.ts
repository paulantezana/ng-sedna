

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

import { SnValidateStatus } from 'ngx-sedna/core/types';

const iconTypeMap = {
  error: 'close-circle-fill',
  validating: 'loading',
  success: 'check-circle-fill',
  warning: 'exclamation-circle-fill'
} as const;

@Component({
  selector: 'sn-form-item-feedback-icon',
  exportAs: 'snFormFeedbackIcon',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <span *ngIf="iconType" sn-icon [snType]="iconType"></span> `,
  host: {
    class: 'ant-form-item-feedback-icon',
    '[class.ant-form-item-feedback-icon-error]': 'status==="error"',
    '[class.ant-form-item-feedback-icon-warning]': 'status==="warning"',
    '[class.ant-form-item-feedback-icon-success]': 'status==="success"',
    '[class.ant-form-item-feedback-icon-validating]': 'status==="validating"'
  }
})
export class SnFormItemFeedbackIconComponent implements OnChanges {
  @Input() status: SnValidateStatus = '';
  constructor(public cdr: ChangeDetectorRef) {}

  iconType: (typeof iconTypeMap)[keyof typeof iconTypeMap] | null = null;

  ngOnChanges(_changes: SimpleChanges): void {
    this.updateIcon();
  }

  updateIcon(): void {
    this.iconType = this.status ? iconTypeMap[this.status] : null;
    this.cdr.markForCheck();
  }
}
