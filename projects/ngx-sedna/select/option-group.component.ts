/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ngx-sedna/blob/master/LICENSE
 */

import { ChangeDetectionStrategy, Component, Input, OnChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { NzSafeAny } from 'ngx-sedna/core/types';

@Component({
  selector: 'nz-option-group',
  exportAs: 'nzOptionGroup',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-content></ng-content> `,
  standalone: true
})
export class NzOptionGroupComponent implements OnChanges {
  @Input() nzLabel: string | number | TemplateRef<NzSafeAny> | null = null;
  changes = new Subject<void>();
  ngOnChanges(): void {
    this.changes.next();
  }
}
