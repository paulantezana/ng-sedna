import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';

import { SnOutletModule } from 'ngx-sedna/core/outlet';
import { SnSafeAny } from 'ngx-sedna/core/types';
import { SnIconModule } from 'ngx-sedna/icon';

@Component({
  selector: 'sn-select-item',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *snStringTemplateOutlet="contentTemplateOutlet; context: { $implicit: contentTemplateOutletContext }">
      <div class="ant-select-selection-item-content" *ngIf="deletable; else labelTemplate">{{ label }}</div>
      <ng-template #labelTemplate>{{ label }}</ng-template>
    </ng-container>
    <span *ngIf="deletable && !disabled" class="ant-select-selection-item-remove" (click)="onDelete($event)">
      <span sn-icon snType="close" *ngIf="!removeIcon; else removeIcon"></span>
    </span>
  `,
  host: {
    class: 'ant-select-selection-item',
    '[attr.title]': 'label',
    '[class.ant-select-selection-item-disabled]': 'disabled'
  },
  imports: [SnOutletModule, NgIf, SnIconModule],
  standalone: true
})
export class SnSelectItemComponent {
  @Input() disabled = false;
  @Input() label: string | number | null | undefined = null;
  @Input() deletable = false;
  @Input() removeIcon: TemplateRef<SnSafeAny> | null = null;
  @Input() contentTemplateOutletContext: SnSafeAny | null = null;
  @Input() contentTemplateOutlet: string | TemplateRef<SnSafeAny> | null = null;
  @Output() readonly delete = new EventEmitter<MouseEvent>();

  constructor() {}

  onDelete(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (!this.disabled) {
      this.delete.next(e);
    }
  }
}
