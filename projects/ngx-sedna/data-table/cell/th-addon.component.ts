/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/* eslint-disable @angular-eslint/component-selector */
import { CommonModule, NgIf, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';


@Component({
  selector: 'th[snFilterable], th[snSortable]',
  preserveWhitespaces: false,
  // encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="SnTable-head-caption">
    <div class="SnTable-head-caption-title">
      <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
    </div>
    <div>
      <button></button>
    </div>
  </div>
  <input type="text">
    <!-- <nz-table-filter
      *ngIf="nzShowFilter || nzCustomFilter; else notFilterTemplate"
      [contentTemplate]="notFilterTemplate"
      [extraTemplate]="extraTemplate"
      [customFilter]="nzCustomFilter"
      [filterMultiple]="nzFilterMultiple"
      [listOfFilter]="nzFilters"
      (filterChange)="onFilterValueChange($event)"
    ></nz-table-filter>
    <ng-template #notFilterTemplate>
      <ng-template [ngTemplateOutlet]="nzShowSort ? sortTemplate : contentTemplate"></ng-template>
    </ng-template>
    <ng-template #extraTemplate>
      <ng-content select="[nz-th-extra]"></ng-content>
      <ng-content select="nz-filter-trigger"></ng-content>
    </ng-template>
    <ng-template #sortTemplate>
      <nz-table-sorters
        [sortOrder]="sortOrder"
        [sortDirections]="sortDirections"
        [contentTemplate]="contentTemplate"
      ></nz-table-sorters>
    </ng-template> -->
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  // host: {
  //   '[class.ant-table-column-has-sorters]': 'nzShowSort',
  //   '[class.ant-table-column-sort]': `sortOrder === 'descend' || sortOrder === 'ascend'`
  // },
  // providers: [NzDestroyService],
  imports: [CommonModule],
  standalone: true
})
export class SnThAddOnComponent<T> {
  // static ngAcceptInputType_nzShowSort: BooleanInput;
  // static ngAcceptInputType_nzShowFilter: BooleanInput;
  // static ngAcceptInputType_nzCustomFilter: BooleanInput;

  // manualClickOrder$ = new Subject<NzThAddOnComponent<T>>();
  // calcOperatorChange$ = new Subject<void>();
  // nzFilterValue: NzTableFilterValue = null;
  // sortOrder: NzTableSortOrder = null;
  // sortDirections: NzTableSortOrder[] = ['ascend', 'descend', null];
  // private sortOrderChange$ = new Subject<NzTableSortOrder>();
  // private isNzShowSortChanged = false;
  // private isNzShowFilterChanged = false;


  // selector: 'th[snFilterable], th[snSortable]',

  @Input() snFilterable = true;
  @Input() snSortable = true;
  // @Input() nzSortOrder: NzTableSortOrder = null;
  // @Input() nzSortPriority: number | boolean = false;
  // @Input() nzSortDirections: NzTableSortOrder[] = ['ascend', 'descend', null];
  // @Input() nzFilters: NzTableFilterList = [];
  // @Input() nzSortFn: NzTableSortFn<T> | boolean | null = null;
  // @Input() nzFilterFn: NzTableFilterFn<T> | boolean | null = null;
  // @Input() @InputBoolean() nzShowSort = false;
  // @Input() @InputBoolean() nzShowFilter = false;
  // @Input() @InputBoolean() nzCustomFilter = false;
  // @Output() readonly nzCheckedChange = new EventEmitter<boolean>();
  // @Output() readonly nzSortOrderChange = new EventEmitter<string | null>();
  // @Output() readonly nzFilterChange = new EventEmitter<NzTableFilterValue>();

}
