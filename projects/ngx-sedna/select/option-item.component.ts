

import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SnDestroyService } from 'ngx-sedna/core/services';
import { SnSafeAny } from 'ngx-sedna/core/types';
import { NzIconModule } from 'ngx-sedna/icon';

@Component({
  selector: 'sn-option-item',
  template: `
    <div class="ant-select-item-option-content">
      <ng-template [ngIf]="customContent" [ngIfElse]="noCustomContent">
        <ng-template [ngTemplateOutlet]="template"></ng-template>
      </ng-template>
      <ng-template #noCustomContent>{{ label }}</ng-template>
    </div>
    <div *ngIf="showState && selected" class="ant-select-item-option-state" style="user-select: none" unselectable="on">
      <span nz-icon nzType="check" class="ant-select-selected-icon" *ngIf="!icon; else icon"></span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'ant-select-item ant-select-item-option',
    '[attr.title]': 'title',
    '[class.ant-select-item-option-grouped]': 'grouped',
    '[class.ant-select-item-option-selected]': 'selected && !disabled',
    '[class.ant-select-item-option-disabled]': 'disabled',
    '[class.ant-select-item-option-active]': 'activated && !disabled'
  },
  providers: [SnDestroyService],
  imports: [NgIf, NgTemplateOutlet, NzIconModule],
  standalone: true
})
export class SnOptionItemComponent implements OnChanges, OnInit {
  selected = false;
  activated = false;
  @Input() grouped = false;
  @Input() customContent = false;
  @Input() template: TemplateRef<SnSafeAny> | null = null;
  @Input() disabled = false;
  @Input() showState = false;
  @Input() title?: string | number | null;
  @Input() label: string | number | null = null;
  @Input() value: SnSafeAny | null = null;
  @Input() activatedValue: SnSafeAny | null = null;
  @Input() listOfSelectedValue: SnSafeAny[] = [];
  @Input() icon: TemplateRef<SnSafeAny> | null = null;
  @Input() compareWith!: (o1: SnSafeAny, o2: SnSafeAny) => boolean;
  @Output() readonly itemClick = new EventEmitter<SnSafeAny>();
  @Output() readonly itemHover = new EventEmitter<SnSafeAny>();

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    private destroy$: SnDestroyService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { value, activatedValue, listOfSelectedValue } = changes;
    if (value || listOfSelectedValue) {
      this.selected = this.listOfSelectedValue.some(v => this.compareWith(v, this.value));
    }
    if (value || activatedValue) {
      this.activated = this.compareWith(this.activatedValue, this.value);
    }
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent(this.elementRef.nativeElement, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (!this.disabled) {
            this.ngZone.run(() => this.itemClick.emit(this.value));
          }
        });

      fromEvent(this.elementRef.nativeElement, 'mouseenter')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if (!this.disabled) {
            this.ngZone.run(() => this.itemHover.emit(this.value));
          }
        });
    });
  }
}
