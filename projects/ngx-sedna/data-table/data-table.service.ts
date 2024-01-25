import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, skip, switchMap, takeUntil } from 'rxjs/operators';
import { SnDataTableQueryParams, SnDataTableSortOrder } from './data-table.types';

@Injectable()
export class SnDataTableService implements OnDestroy {
  private destroy$ = new Subject<boolean>();
  private pageIndex$ = new BehaviorSubject<number>(1);
  private pageSize$ = new BehaviorSubject<number>(10);

  pageIndexDistinct$ = this.pageIndex$.pipe(distinctUntilChanged());
  pageSizeDistinct$ = this.pageSize$.pipe(distinctUntilChanged());

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
    this.listOfCalcOperator$
  ]).pipe(
    debounceTime(0),
    skip(1),
    map(([pageIndex, pageSize, listOfCalc]) => ({
      pageIndex,
      pageSize,
      // sort: listOfCalc
      //   .filter(item => item.sortFn)
      //   .map(item => ({
      //     key: item.key!,
      //     value: item.sortOrder
      //   })),
      // filter: listOfCalc
      //   .filter(item => item.filterFn)
      //   .map(item => ({
      //     key: item.key!,
      //     value: item.filterValue
      //   }))
    }))
  );

  updatePageSize(size: number): void {
    this.pageSize$.next(size);
  }

  updatePageIndex(index: number): void {
    this.pageIndex$.next(index);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
