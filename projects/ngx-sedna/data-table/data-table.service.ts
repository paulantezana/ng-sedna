import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, skip } from 'rxjs/operators';
import { SnDataTableColumn, SnDataTableQueryParams, SnDataTableSort, SnDataTableSortOrder } from './data-table.types';
import { SnFilter, SnFilterEvaluation } from '../filter';
import { filterTableParentId } from './constants';

@Injectable()
export class SnDataTableService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  private pageIndex$ = new BehaviorSubject<number>(1);
  private pageSize$ = new BehaviorSubject<number>(20);
  private filter$ = new BehaviorSubject<SnFilter[]>([]);
  private sort$ = new BehaviorSubject<SnDataTableSort[]>([]);
  private columns$ = new BehaviorSubject<SnDataTableColumn[]>([]);

  pageIndexDistinct$ = this.pageIndex$.pipe(distinctUntilChanged());
  pageSizeDistinct$ = this.pageSize$.pipe(distinctUntilChanged());
  filterDistinct$ = this.filter$.pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)));
  sortDistinct$ = this.sort$.pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)));

  queryParams$: Observable<SnDataTableQueryParams> = combineLatest([
    this.pageIndexDistinct$,
    this.pageSizeDistinct$,
    this.filterDistinct$,
    this.sortDistinct$
  ]).pipe(
    debounceTime(0),
    skip(1),
    map(([pageIndex, pageSize, filter, sort]) => ({
      pageIndex,
      pageSize,
      filter,
      sort: sort.filter(item => !!item.direction)
    }))
  );

  updatePageSize(size: number): void {
    this.pageSize$.next(size);
  }

  updatePageIndex(index: number): void {
    this.pageIndex$.next(index);
  }

  updateColumns(columns: SnDataTableColumn[]): void {
    this.columns$.next(columns);
  }

  updateFilter(filter: SnFilter[]): void {
    this.filter$.next(filter);
  }

  updateSorter(field: string, direction: SnDataTableSortOrder): void {
    // if(!!direction){
      this.sort$.next([{ field, direction }]);
    // } else {
    //   this.sort$.next([]);
    // }
  }

  updateFilterFromTable(field: string, value: string) {
    const columns = this.columns$.getValue();

    //  Get columns
    const column = columns.find(item => item.field === field);
    if (column === undefined) {
      return;
    }

    // Get Current Filter
    const currentFilter = this.filter$.getValue();
    const indexMatch = currentFilter.findIndex(item => item.id === filterTableParentId);
    const columnMatch = currentFilter[indexMatch]?.eval?.find(item => item.field === column.field);

    let newFilter: SnFilter[] = [];

    // Remove Is Empty
    if (value.trim() === '') {
      newFilter = currentFilter.map(flt => flt.id === filterTableParentId ? ({
        ...flt,
        eval: flt.eval.filter(item => item.field !== field)
      }) : flt).filter(item => item.eval.length > 1);

      this.filter$.next(newFilter);
      return;
    }

    const newEvaluation: SnFilterEvaluation = {
      id: this.getNewFilterIndexId(),
      logicalOperator: 'AND',
      prefix: 'DONDE',
      operator: (column?.type || 'text') === 'text' ? 'contiene' : '=',
      title: column?.title || '',
      field: column?.field || '',
      type: column?.type || 'text',
      value1: value,
      value2: ''
    };

    if (columnMatch !== undefined) { // Update
      newFilter = currentFilter.map(flt => flt.id === filterTableParentId ? ({
        ...flt,
        eval: flt.eval.map(item => item.field === field ? ({ ...item, value1: value }) : item)
      }) : flt);
    } else if (indexMatch !== -1) { // Add Colum Filter
      newFilter = currentFilter.map(flt => flt.id === filterTableParentId ? ({
        ...flt,
        eval: [...flt.eval, newEvaluation]
      }) : flt);
    } else { // First filter
      newFilter = [...currentFilter, {
        id: filterTableParentId,
        logicalOperator: 'OR',
        prefix: 'DONDE',
        eval: [newEvaluation]
      }];
    }

    // Set next
    const filter = this.filter$.getValue();
    console.log({ newFilter, filter }, '_add_filter_from_table');
    this.filter$.next(newFilter);
  }

  removeFilterFromTable(id: number, parentId: number){
    const filter = this.filter$.getValue();
    const newFilter = filter.map((flt) => flt.id === parentId ? ({
      ...flt,
      eval: flt.eval.filter(item => item.id !== id)
    }) : flt).filter(flt => flt.eval.length > 0);
    this.filter$.next(newFilter);
  }

  private getNewFilterIndexId() {
    const filter = this.filter$.getValue();
    return filter.reduce((a, b) => a + b.eval.length, 0) + 1
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
