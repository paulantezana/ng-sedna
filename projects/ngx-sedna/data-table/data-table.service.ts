import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, skip, switchMap, takeUntil } from 'rxjs/operators';
import { SnDataTableQueryParams, SnDataTableSortOrder } from './data-table.types';
import { SnFilter } from '../filter';

@Injectable()
export class SnDataTableService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  private pageIndex$ = new BehaviorSubject<number>(1);
  private pageSize$ = new BehaviorSubject<number>(10);
  private filter$ = new BehaviorSubject<SnFilter[]>([]);
  private sorter$ = new BehaviorSubject<any>([]);

  pageIndexDistinct$ = this.pageIndex$.pipe(distinctUntilChanged());
  pageSizeDistinct$ = this.pageSize$.pipe(distinctUntilChanged());
  filterDistinct$ = this.filter$.pipe(distinctUntilChanged());
  sorterDistinct$ = this.sorter$.pipe(distinctUntilChanged());

  listOfCalcOperator$ = new BehaviorSubject<
    Array<{
      key?: string;
      // sortFn: NzTableSortFn<T> | null | boolean;
      sortOrder: SnDataTableSortOrder;
      // filterFn: NzTableFilterFn<T> | null | boolean;
      // filterValue: NzTableFilterValue;
      // sortPriority: number | boolean;
    }>
  >([]);


  queryParams$: Observable<SnDataTableQueryParams> = combineLatest([
    this.pageIndexDistinct$,
    this.pageSizeDistinct$,
    this.filterDistinct$,
    this.sorterDistinct$
  ]).pipe(
    debounceTime(0),
    skip(1),
    map(([pageIndex, pageSize, filter, sorter]) => ({
      pageIndex,
      pageSize,
      filter,
      sorter
    }))
  );

  updatePageSize(size: number): void {
    this.pageSize$.next(size);
  }

  updatePageIndex(index: number): void {
    this.pageIndex$.next(index);
  }

  updateFilter(filter: SnFilter[]): void {
    this.filter$.next(filter);
  }

  updateSorter(sorter: any): void {
    this.sorter$.next(sorter);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
