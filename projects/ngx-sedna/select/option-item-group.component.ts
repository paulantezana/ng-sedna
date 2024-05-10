/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ngx-sedna/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { NzOutletModule } from 'ngx-sedna/core/outlet';
import { NzSafeAny } from 'ngx-sedna/core/types';

@Component({
  selector: 'nz-option-item-group',
  template: ` <ng-container *nzStringTemplateOutlet="nzLabel">{{ nzLabel }}</ng-container> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ant-select-item ant-select-item-group'
  },
  imports: [NzOutletModule],
  standalone: true
})
export class NzOptionItemGroupComponent {
  @Input() nzLabel: string | number | TemplateRef<NzSafeAny> | null = null;

  constructor() {}
}
