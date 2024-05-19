

import { ChangeDetectionStrategy, Component, Input, OnChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { SnSafeAny } from 'ngx-sedna/core/types';

@Component({
  selector: 'nz-option-group',
  exportAs: 'nzOptionGroup',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-content></ng-content> `,
  standalone: true
})
export class NzOptionGroupComponent implements OnChanges {
  @Input() nzLabel: string | number | TemplateRef<SnSafeAny> | null = null;
  changes = new Subject<void>();
  ngOnChanges(): void {
    this.changes.next();
  }
}
