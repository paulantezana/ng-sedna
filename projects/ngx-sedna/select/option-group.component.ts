

import { ChangeDetectionStrategy, Component, Input, OnChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { SnSafeAny } from 'ngx-sedna/core/types';

@Component({
  selector: 'sn-option-group',
  exportAs: 'snOptionGroup',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-content></ng-content> `,
  standalone: true
})
export class SnOptionGroupComponent implements OnChanges {
  @Input() snLabel: string | number | TemplateRef<SnSafeAny> | null = null;
  changes = new Subject<void>();
  ngOnChanges(): void {
    this.changes.next();
  }
}
