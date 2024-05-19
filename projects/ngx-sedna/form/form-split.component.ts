

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'sn-form-split',
  exportAs: 'snFormSplit',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-content></ng-content> `,
  host: {
    class: 'ant-form-split'
  },
  standalone: true
})
export class SnFormSplitComponent {}
