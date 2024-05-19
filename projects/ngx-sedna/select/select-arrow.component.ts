

import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';

import { SnOutletModule } from 'ngx-sedna/core/outlet';
import { SnSafeAny } from 'ngx-sedna/core/types';
import { NzIconModule } from 'ngx-sedna/icon';

@Component({
  selector: 'nz-select-arrow',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="isMaxTagCountSet">
      <span>{{ listOfValue.length }} / {{ nzMaxMultipleCount }}</span>
    </ng-container>
    <span nz-icon nzType="loading" *ngIf="loading; else defaultArrow"></span>
    <ng-template #defaultArrow>
      <ng-container *ngIf="showArrow && !suffixIcon; else suffixTemplate">
        <span nz-icon nzType="down" *ngIf="!search"></span>
        <span nz-icon nzType="search" *ngIf="search"></span>
      </ng-container>
      <ng-template #suffixTemplate>
        <ng-container *nzStringTemplateOutlet="suffixIcon; let suffixIcon">
          <span *ngIf="suffixIcon" nz-icon [nzType]="suffixIcon"></span>
        </ng-container>
      </ng-template>
    </ng-template>
    <ng-container *nzStringTemplateOutlet="feedbackIcon">{{ feedbackIcon }}</ng-container>
  `,
  host: {
    class: 'ant-select-arrow',
    '[class.ant-select-arrow-loading]': 'loading'
  },
  imports: [NzIconModule, NgIf, SnOutletModule],
  standalone: true
})
export class NzSelectArrowComponent {
  @Input() listOfValue: SnSafeAny[] = [];
  @Input() loading = false;
  @Input() search = false;
  @Input() showArrow = false;
  @Input() isMaxTagCountSet = false;
  @Input() suffixIcon: TemplateRef<SnSafeAny> | string | null = null;
  @Input() feedbackIcon: TemplateRef<SnSafeAny> | string | null = null;
  @Input() nzMaxMultipleCount: number = Infinity;

  constructor() {}
}
