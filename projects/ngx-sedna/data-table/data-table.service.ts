import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinct, distinctUntilChanged, filter, map, skip, switchMap, takeUntil } from 'rxjs/operators';
import { SnDataTableColumn, SnDataTableQueryParams, SnDataTableSortOrder } from './data-table.types';
import { SnFilter, SnFilterEvaluation } from '../filter';

@Injectable()
export class SnDataTableService implements OnDestroy {
  private destroy$ = new Subject<boolean>();

  private pageIndex$ = new BehaviorSubject<number>(1);
  private pageSize$ = new BehaviorSubject<number>(10);
  private filter$ = new BehaviorSubject<SnFilter[]>([]);
  private sorter$ = new BehaviorSubject<any>([]);
  private columns$ = new BehaviorSubject<SnDataTableColumn[]>([]);

  pageIndexDistinct$ = this.pageIndex$.pipe(distinctUntilChanged());
  pageSizeDistinct$ = this.pageSize$.pipe(distinctUntilChanged());
  // filterDistinct$ = this.filter$.pipe(distinctUntilChanged((prev, curr) => JSON.stringify(prev) == JSON.stringify(curr)));
  filterDistinct$ = this.filter$.pipe(distinct(e => JSON.stringify(e)))
  sorterDistinct$ = this.sorter$.pipe(distinctUntilChanged());

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

  updateColumns(columns: SnDataTableColumn[]): void {
    this.columns$.next(columns);
  }

  updateFilter(filter: SnFilter[]): void {
    this.filter$.next(filter);
  }

  updateSorter(sorter: any): void {
    this.sorter$.next(sorter);
  }

  updateFilterFromTable(field: string, value: string) {
    const filterParentId = 0;
    const columns = this.columns$.getValue();

    //  Get columns
    const column = columns.find(item => item.field === field);
    if(column === undefined){
      return;
    }

    // Get Current Filter
    let newFilter = this.filter$.getValue();

    const indexMatch = newFilter.findIndex(item => item.id === filterParentId);
    const columnMatch = newFilter[indexMatch]?.eval?.find(item => item.field === column.field);

    if (value.trim() === '') {
      if (columnMatch !== undefined) {
        newFilter[indexMatch].eval = newFilter[indexMatch].eval.filter(item => item.field !== column.field); // delete
        if (newFilter[indexMatch].eval.length === 0) {
          newFilter.splice(indexMatch, 1);
        }
      }
      // Set next
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

    if (columnMatch !== undefined) {
      newFilter[indexMatch].eval = newFilter[indexMatch].eval.map(item => item.field === column.field ? ({ ...item, value1: value }) : item);
    } else if (indexMatch !== -1) {
      newFilter[indexMatch].eval = [...newFilter[indexMatch].eval, newEvaluation];
    } else {
      newFilter.push({
        id: filterParentId,
        logicalOperator: 'OR',
        prefix: 'DONDE',
        eval: [newEvaluation]
      });
    }

    // Set next
    console.log({ newFilter }, '_add_filter_');
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
