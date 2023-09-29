import { ChangeDetectorRef, Component } from '@angular/core';

export type SnFormItemStatusType = 'success' | 'danger' | 'warning' | 'validating' | '';

@Component({
  selector: 'sn-form-feedback',
  exportAs: 'snFormFeedback',
  templateUrl: './form-feedback.component.html',
})
export class SnFormFeedbackComponent {
  status: SnFormItemStatusType = '';
  // hasFeedback = false;
  // withHelpClass = false;

  constructor(private cdr: ChangeDetectorRef) {}

  setStatus(status: SnFormItemStatusType): void {
    this.status = status;
    this.cdr.markForCheck();
  }
}
