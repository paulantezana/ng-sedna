import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  inject
} from '@angular/core';

import { CdkMenuModule } from '@angular/cdk/menu';
import { Subject, takeUntil } from 'rxjs';
import { SnDataTableSortOrder } from '../data-table.types';
import { SnDataTableService } from '../data-table.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUpWideShort, faArrowDownWideShort, faTableColumns, faSortUp, faSortDown, faAngleDown, faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { SnFilterEvaluation } from '../../filter';
import { filterTableParentId } from '../constants';

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
  imports: [CommonModule, CdkMenuModule, FontAwesomeModule],
  standalone: true
})
export class SnThAddOnComponent<T> {
  private snDataTableService = inject(SnDataTableService);

  private destroy$ = new Subject<boolean>();

  faArrowUpWideShort = faArrowUpWideShort;
  faArrowDownWideShort = faArrowDownWideShort;
  faTableColumns = faTableColumns;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faAngleDown = faAngleDown;
  faFilter = faFilter;
  faFilterCircleXmark = faFilterCircleXmark;

  // static ngAcceptInputType_nzShowSort: BooleanInput;
  // static ngAcceptInputType_nzShowFilter: BooleanInput;
  // static ngAcceptInputType_nzCustomFilter: BooleanInput;

  // manualClickOrder$ = new Subject<NzThAddOnComponent<T>>();
  // calcOperatorChange$ = new Subject<void>();
  // nzFilterValue: NzTableFilterValue = null;
  sortOrder: SnDataTableSortOrder = null;
  sortDirections: SnDataTableSortOrder[] = ['asc', 'desc', null];
  filterEvaluation?: SnFilterEvaluation;


  // filterValue: string = '';
  // filterValue: string = '';

  // private sortOrderChange$ = new Subject<NzTableSortOrder>();
  // private isNzShowSortChanged = false;
  // private isNzShowFilterChanged = false;


  // selector: 'th[snFilterable], th[snSortable]',

  @Input() snFilterable?: boolean = true;
  @Input() snSortable?: boolean = true;
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
    const { sortDistinct$, filterDistinct$ } = this.snDataTableService;

    sortDistinct$.pipe(takeUntil(this.destroy$)).subscribe(sort => {
      const currentSort = sort.find(item => item.field === this.snColumnField)
      if (currentSort && currentSort.direction !== this.sortOrder) {
        this.sortOrder = currentSort.direction;
      }
    });

    filterDistinct$.pipe(takeUntil(this.destroy$)).subscribe(filter => {
      const indexMatch = filter.findIndex(item => item.id === filterTableParentId);
      const evaluation = filter[indexMatch]?.eval?.find(item => item.field === this.snColumnField);

      // Reset if not exist
      if (!evaluation) {
        this.filterEvaluation = undefined;
      }

      // Set current evaluation
      if (JSON.stringify(evaluation ?? {}) !== JSON.stringify(this.filterEvaluation ?? {})) {
        this.filterEvaluation = evaluation;
      }
    });
  }

  getNextSortDirection(sortDirections: SnDataTableSortOrder[], current: SnDataTableSortOrder): SnDataTableSortOrder {
    const index = sortDirections.indexOf(current);
    if (index === sortDirections.length - 1) {
      return sortDirections[0];
    } else {
      return sortDirections[index + 1];
    }
  }

  onSortToggle() {
    const nextOrder = this.getNextSortDirection(this.sortDirections, this.sortOrder!);
    if (!!this.snColumnField && this.snSortable) {
      this.snDataTableService.updateSorter(this.snColumnField, nextOrder);
    }
  }

  onSort(direction: SnDataTableSortOrder) {
    if (!!this.snColumnField) {
      this.snDataTableService.updateSorter(this.snColumnField, direction);
    }
  }

  onKeyDownInputSearch(e: any) {
    if (e.key === 'Enter' && !!this.snColumnField) {
      this.snDataTableService.updateFilterFromTable(this.snColumnField, e?.target?.value || '')
    }
  }

  onRemoveFilter(){
    if(!!this.filterEvaluation){
      this.snDataTableService.removeFilterFromTable(this.filterEvaluation.id, filterTableParentId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
