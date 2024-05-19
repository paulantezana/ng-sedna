

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nz-form-split',
  exportAs: 'nzFormSplit',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-content></ng-content> `,
  host: {
    class: 'ant-form-split'
  },
  standalone: true
})
export class NzFormSplitComponent {}
