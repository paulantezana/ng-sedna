/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ngx-sedna/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { NzOutletModule } from 'ngx-sedna/core/outlet';
import { NzSafeAny } from 'ngx-sedna/core/types';

@Component({
  selector: 'nz-select-placeholder',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *nzStringTemplateOutlet="placeholder">
      {{ placeholder }}
    </ng-container>
  `,
  host: { class: 'ant-select-selection-placeholder' },
  imports: [NzOutletModule],
  standalone: true
})
export class NzSelectPlaceholderComponent {
  @Input() placeholder: TemplateRef<NzSafeAny> | string | null = null;

  constructor() {}
}
