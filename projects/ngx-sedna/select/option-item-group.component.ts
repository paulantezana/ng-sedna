

import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { SnOutletModule } from 'ngx-sedna/core/outlet';
import { SnSafeAny } from 'ngx-sedna/core/types';

@Component({
  selector: 'sn-option-item-group',
  template: ` <ng-container *snStringTemplateOutlet="snLabel">{{ snLabel }}</ng-container> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ant-select-item ant-select-item-group'
  },
  imports: [SnOutletModule],
  standalone: true
})
export class SnOptionItemGroupComponent {
  @Input() snLabel: string | number | TemplateRef<SnSafeAny> | null = null;

  constructor() {}
}
