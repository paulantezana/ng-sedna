import { OverlayModule } from '@angular/cdk/overlay';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { isPlatformBrowser, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  NgZone,
  OnChanges,
  Output,
  PLATFORM_ID,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';

import { SnOverlayModule } from 'ngx-sedna/core/overlay';
import { SnSafeAny } from 'ngx-sedna/core/types';
import { SnEmptyModule } from 'ngx-sedna/empty';

import { SnOptionItemGroupComponent } from './option-item-group.component';
import { SnOptionItemComponent } from './option-item.component';
import { SnSelectItemInterface, SnSelectModeType } from './select.types';

@Component({
  selector: 'sn-option-container',
  exportAs: 'snOptionContainer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false,
  template: `
    <div>
      <div *ngIf="listOfContainerItem.length === 0" class="ant-select-item-empty">
        <sn-embed-empty snComponentName="select" [specificContent]="notFoundContent!"></sn-embed-empty>
      </div>
      <cdk-virtual-scroll-viewport
        [class.full-width]="!matchWidth"
        [itemSize]="itemSize"
        [maxBufferPx]="itemSize * maxItemLength"
        [minBufferPx]="itemSize * maxItemLength"
        (scrolledIndexChange)="onScrolledIndexChange($event)"
        [style.height.px]="listOfContainerItem.length * itemSize"
        [style.max-height.px]="itemSize * maxItemLength"
      >
        <ng-template
          cdkVirtualFor
          [cdkVirtualForOf]="listOfContainerItem"
          [cdkVirtualForTrackBy]="trackValue"
          [cdkVirtualForTemplateCacheSize]="0"
          let-item
        >
          <ng-container [ngSwitch]="item.type">
            <sn-option-item-group *ngSwitchCase="'group'" [snLabel]="item.groupLabel"></sn-option-item-group>
            <sn-option-item
              *ngSwitchCase="'item'"
              [icon]="menuItemSelectedIcon"
              [customContent]="item.snCustomContent"
              [template]="item.template"
              [grouped]="!!item.groupLabel"
              [disabled]="item.snDisabled || (isMaxLimitReached && !listOfSelectedValue.includes(item['snValue']))"
              [showState]="mode === 'tags' || mode === 'multiple'"
              [title]="item.snTitle"
              [label]="item.snLabel"
              [compareWith]="compareWith"
              [activatedValue]="activatedValue"
              [listOfSelectedValue]="listOfSelectedValue"
              [value]="item.snValue"
              (itemHover)="onItemHover($event)"
              (itemClick)="onItemClick($event)"
            ></sn-option-item>
          </ng-container>
        </ng-template>
      </cdk-virtual-scroll-viewport>
      <ng-template [ngTemplateOutlet]="dropdownRender"></ng-template>
    </div>
  `,
  host: { class: 'ant-select-dropdown' },
  imports: [
    SnEmptyModule,
    NgIf,
    NgSwitch,
    SnOptionItemGroupComponent,
    NgSwitchCase,
    SnOptionItemComponent,
    NgTemplateOutlet,
    OverlayModule,
    SnOverlayModule
  ],
  standalone: true
})
export class SnOptionContainerComponent implements OnChanges, AfterViewInit {
  @Input() notFoundContent: string | TemplateRef<SnSafeAny> | undefined = undefined;
  @Input() menuItemSelectedIcon: TemplateRef<SnSafeAny> | null = null;
  @Input() dropdownRender: TemplateRef<SnSafeAny> | null = null;
  @Input() activatedValue: SnSafeAny | null = null;
  @Input() listOfSelectedValue: SnSafeAny[] = [];
  @Input() compareWith!: (o1: SnSafeAny, o2: SnSafeAny) => boolean;
  @Input() mode: SnSelectModeType = 'default';
  @Input() matchWidth = true;
  @Input() itemSize = 32;
  @Input() maxItemLength = 8;
  @Input() isMaxLimitReached = false;
  @Input() listOfContainerItem: SnSelectItemInterface[] = [];
  @Output() readonly itemClick = new EventEmitter<SnSafeAny>();
  @Output() readonly scrollToBottom = new EventEmitter<void>();
  @ViewChild(CdkVirtualScrollViewport, { static: true }) cdkVirtualScrollViewport!: CdkVirtualScrollViewport;
  private scrolledIndex = 0;
  private ngZone = inject(NgZone);
  private platformId = inject(PLATFORM_ID);

  onItemClick(value: SnSafeAny): void {
    this.itemClick.emit(value);
  }

  onItemHover(value: SnSafeAny): void {
    // TODO: keydown.enter won't activate this value
    this.activatedValue = value;
  }

  trackValue(_index: number, option: SnSelectItemInterface): SnSafeAny {
    return option.key;
  }

  onScrolledIndexChange(index: number): void {
    this.scrolledIndex = index;
    if (index === this.listOfContainerItem.length - this.maxItemLength - 1) {
      this.scrollToBottom.emit();
    }
  }

  scrollToActivatedValue(): void {
    const index = this.listOfContainerItem.findIndex(item => this.compareWith(item.key, this.activatedValue));
    if (index < this.scrolledIndex || index >= this.scrolledIndex + this.maxItemLength) {
      this.cdkVirtualScrollViewport.scrollToIndex(index || 0);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { listOfContainerItem, activatedValue } = changes;
    if (listOfContainerItem || activatedValue) {
      this.scrollToActivatedValue();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => setTimeout(() => this.scrollToActivatedValue()));
    }
  }
}
