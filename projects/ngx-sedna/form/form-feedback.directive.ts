import { Directive, HostBinding } from '@angular/core';

export type SnFeedbackType = 'success' | 'danger' | 'warning' | 'validating' | '';

@Directive({
  selector: '[sn-form-feedback]',
  exportAs: 'snFormFeedback',
  host: {
    'class': 'SnForm-help',
  },
})
export class SnFormFeedbackDirective {
  snType: SnFeedbackType = '';

  @HostBinding('class')
  get ascClass () {
    return  {
      ['success'] : this.snType === 'success' ,
      ['danger'] : this.snType === 'danger' ,
      ['warning'] : this.snType === 'warning' ,
    }
  }
}
