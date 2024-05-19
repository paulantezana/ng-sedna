

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

import { SnSafeAny } from 'ngx-sedna/core/types';
import { NzIconModule } from 'ngx-sedna/icon';

@Component({
  selector: 'sn-select-clear',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      nz-icon
      nzType="close-circle"
      nzTheme="fill"
      *ngIf="!clearIcon; else clearIcon"
      class="ant-select-close-icon"
    ></span>
  `,
  host: {
    class: 'ant-select-clear',
    '(click)': 'onClick($event)'
  },
  imports: [NzIconModule, NgIf],
  standalone: true
})
export class SnSelectClearComponent {
  @Input() clearIcon: TemplateRef<SnSafeAny> | null = null;
  @Output() readonly clear = new EventEmitter<MouseEvent>();

  constructor() {}

  onClick(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.clear.emit(e);
  }
}
