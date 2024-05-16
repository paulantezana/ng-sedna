import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { SnOutletModule } from 'ngx-sedna/core/outlet';
import { SnSafeAny } from 'ngx-sedna/core/types';

@Component({
  selector: 'sn-select-placeholder',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *snStringTemplateOutlet="placeholder">
      {{ placeholder }}
    </ng-container>
  `,
  host: { class: 'ant-select-selection-placeholder' },
  imports: [SnOutletModule],
  standalone: true
})
export class SnSelectPlaceholderComponent {
  @Input() placeholder: TemplateRef<SnSafeAny> | string | null = null;

  constructor() {}
}
