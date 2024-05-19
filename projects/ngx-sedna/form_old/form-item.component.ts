import { ChangeDetectorRef, Component, Input } from '@angular/core';

export type SnFormItemStatus = 'success' | 'danger' | 'warning' | 'validating' | '';
export type SnFormItemType = 'outlined' | 'floating' | '';

@Component({
  selector: 'sn-form-item',
  exportAs: 'snFormItem',
  templateUrl: './form-item.component.html',
})
export class SnFormItemComponent {
  status: SnFormItemStatus = '';
  @Input() antype: SnFormItemType = '';
  // hasFeedback = false;
  // withHelpClass = false;

  constructor(private cdr: ChangeDetectorRef) {}

  setStatus(status: SnFormItemStatus): void {
    this.status = status;
    this.cdr.markForCheck();
  }
}
