

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nz-form-text',
  exportAs: 'nzFormText',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ` <ng-content></ng-content> `,
  host: {
    class: 'ant-form-text'
  },
  standalone: true
})
export class NzFormTextComponent {}
