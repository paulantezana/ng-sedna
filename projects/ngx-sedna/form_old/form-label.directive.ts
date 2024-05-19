import { Directive } from '@angular/core';

@Directive({
  selector: 'label[sn-label]',
  exportAs: 'snLabel',
  host: {
    'class': 'SnForm-label',
  },
})
export class SnFormLabelDirective {

}
