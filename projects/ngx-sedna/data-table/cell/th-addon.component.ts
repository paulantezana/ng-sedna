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
  ViewEncapsulation,
  inject
} from '@angular/core';

import { CdkMenuModule } from '@angular/cdk/menu';
import { Subject, filter, fromEvent, takeUntil } from 'rxjs';
import { SnDataTableSortOrder } from '../data-table.types';
import { SnDataTableService } from '../data-table.service';

@Component({
  selector: 'th[snFilterable], th[snSortable]',
  preserveWhitespaces: false,
  // encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './th-addon.component.html',
  styleUrl: './th-addon.component.scss',
  // host: {
  //   '[class.ant-table-column-has-sorters]': 'nzShowSort',
  //   '[class.ant-table-column-sort]': `sortOrder === 'descend' || sortOrder === 'ascend'`
  // },
  // providers: [NzDestroyService],
  imports: [CommonModule, CdkMenuModule],
  standalone: true
})
export class SnThAddOnComponent<T> {
  private snDataTableService = inject(SnDataTableService);

  private destroy$ = new Subject<boolean>();

  private ngZone = inject(NgZone);
  private host = inject(ElementRef<HTMLElement>);

  // static ngAcceptInputType_nzShowSort: BooleanInput;
  // static ngAcceptInputType_nzShowFilter: BooleanInput;
  // static ngAcceptInputType_nzCustomFilter: BooleanInput;

  // manualClickOrder$ = new Subject<NzThAddOnComponent<T>>();
  // calcOperatorChange$ = new Subject<void>();
  // nzFilterValue: NzTableFilterValue = null;
  sortOrder: SnDataTableSortOrder = null;
  sortDirections: SnDataTableSortOrder[] = ['asc', 'desc', null];
  // private sortOrderChange$ = new Subject<NzTableSortOrder>();
  // private isNzShowSortChanged = false;
  // private isNzShowFilterChanged = false;


  // selector: 'th[snFilterable], th[snSortable]',

  @Input() snFilterable = true;
  @Input() snSortable = true;
  @Input() snColumnField?: string;
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


  ngOnInit(): void {
    // this.ngZone.runOutsideAngular(() =>
    //   fromEvent(this.host.nativeElement, 'click')
    //     .pipe(
    //       // filter(() => this.nzShowSort),
    //       takeUntil(this.destroy$)
    //     )
    //     .subscribe(() => {
    //       console.log('NANI')
    //       // const nextOrder = this.getNextSortDirection(this.sortDirections, this.sortOrder!);
    //       // this.ngZone.run(() => {
    //       //   this.setSortOrder(nextOrder);
    //       //   this.manualClickOrder$.next(this);
    //       // });
    //     })
    // );
  }

  getNextSortDirection(sortDirections: SnDataTableSortOrder[], current: SnDataTableSortOrder): SnDataTableSortOrder {
    const index = sortDirections.indexOf(current);
    if (index === sortDirections.length - 1) {
      return sortDirections[0];
    } else {
      return sortDirections[index + 1];
    }
  }

  onTableSort(){
    const nextOrder = this.getNextSortDirection(this.sortDirections, this.sortOrder!);
    this.sortOrder = nextOrder;
  }

  onKeyDownInputSearch(e: any) {
    if (e.key === 'Enter' && this.snColumnField != undefined) {
      this.snDataTableService.updateFilterFromTable(this.snColumnField, e?.target?.value || '')
    }
  }

  onTableMenuClick(key: string) {
    // const colum = this.columns.find(item => item.field === field);
    // if (colum === undefined) {
    //   alert('ERROR: column not found');
    //   return;
    // }

    // switch (key) {
    //   case 'asc':
    //     this.addNewSort(field, 'asc', false);
    //     break;
    //   case 'desc':
    //     this.addNewSort(field, 'desc', false);
    //     break;
    //   case 'hideColumn':
    //     this.onHideVisibility(colum.field);
    //     break;
    //   case 'showColumns':
    //     this.tableShuffleIsOpen = true;
    //     break;
    //   case 'clearFilter':
    //     this.removeFilter(colum);
    //     break;
    //   default:
    //     break;
    // }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
