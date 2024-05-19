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
  antype: SnFeedbackType = '';

  @HostBinding('class')
  get ascClass () {
    return  {
      ['success'] : this.antype === 'success' ,
      ['danger'] : this.antype === 'danger' ,
      ['warning'] : this.antype === 'warning' ,
    }
  }
}
