import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { SnOutletModule } from 'ngx-sedna/core/outlet';
import { SnSafeAny } from 'ngx-sedna/core/types';
import { SnIconModule } from 'ngx-sedna/icon';

@Component({
  selector: 'sn-select-arrow',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="isMaxTagCountSet">
      <span>{{ listOfValue.length }} / {{ snMaxMultipleCount }}</span>
    </ng-container>
    <span sn-icon snType="loading" *ngIf="loading; else defaultArrow"></span>
    <ng-template #defaultArrow>
      <ng-container *ngIf="showArrow && !suffixIcon; else suffixTemplate">
        <span sn-icon snType="down" *ngIf="!search"></span>
        <span sn-icon snType="search" *ngIf="search"></span>
      </ng-container>
      <ng-template #suffixTemplate>
        <ng-container *snStringTemplateOutlet="suffixIcon; let suffixIcon">
          <span *ngIf="suffixIcon" sn-icon [snType]="suffixIcon"></span>
        </ng-container>
      </ng-template>
    </ng-template>
    <ng-container *snStringTemplateOutlet="feedbackIcon">{{ feedbackIcon }}</ng-container>
  `,
  host: {
    class: 'ant-select-arrow',
    '[class.ant-select-arrow-loading]': 'loading'
  },
  imports: [SnIconModule, NgIf, SnOutletModule],
  standalone: true
})
export class SnSelectArrowComponent {
  @Input() listOfValue: SnSafeAny[] = [];
  @Input() loading = false;
  @Input() search = false;
  @Input() showArrow = false;
  @Input() isMaxTagCountSet = false;
  @Input() suffixIcon: TemplateRef<SnSafeAny> | string | null = null;
  @Input() feedbackIcon: TemplateRef<SnSafeAny> | string | null = null;
  @Input() snMaxMultipleCount: number = Infinity;

  constructor() {}
}
