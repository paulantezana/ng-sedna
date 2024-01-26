import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, skip, switchMap, takeUntil } from 'rxjs/operators';
import { SnFilter, SnFilterColumn, SnFilterEvaluation } from '../filter';

@Injectable()
export class SnFilterService implements OnDestroy {
  private destroy$ = new Subject<boolean>();
  private filter$ = new BehaviorSubject<SnFilter[]>([]);

  filterDistinct$ = this.filter$.pipe(distinctUntilChanged());

  filterParams$: Observable<SnFilter[]> = combineLatest([
    this.filterDistinct$,
  ]).pipe(
    debounceTime(0),
    skip(1),
    map(([filter]) => (filter))
  );

  updateFilter(filter: SnFilter[]): void {
    this.filter$.next(filter);
  }

  updateEvalValues(newValues: any, id: number, parentId: number): void {
    const filter = this.filter$.getValue();
    const newFilter = filter.map((flt) => flt.id === parentId ? ({
      ...flt,
      eval: flt.eval.map(item => item.id == id ? ({ ...item, ...newValues }) : item)
    }) : flt);

    console.log({ filter, newFilter }, 'UPDATE EVAL VALUES');
    this.filter$.next(newFilter);
  }

  addFilter(key: string, parentId: number, columns : SnFilterColumn[]) {
    const filter = this.filter$.getValue();
    const firstColumn = columns[0];

    // Validation
    if (firstColumn === undefined) {
      alert('ERROR: Filter add snFilterColumns not found');
      return;
    }

    // New Filter
    let newFilter : SnFilter[] = [];

    // Process
    switch (key) {
      case 'SI': // Si
      case 'SI_NO': // Si no
        const indexMatch = filter.findIndex(item => item.id === parentId);
        const newEval: SnFilterEvaluation = this.createFilterEvaluation(key, 'AND', firstColumn);

        if (indexMatch === -1) {
          newFilter = [...filter, {
            id: filter.length + 1,
            logicalOperator: 'AND',
            prefix: key === 'SI' ? 'DONDE' : 'DONDE NO',
            eval: [newEval]
          }]
        } else {
          newFilter = filter.map(flt => flt.id === parentId ? ({
            ...flt,
            eval: [...flt.eval, newEval]
          }) : flt)
        }
        break;
      case 'O': // o
      case 'O_NO': // o no
        const newOrEval: SnFilterEvaluation = this.createFilterEvaluation(key, 'OR', firstColumn);

        newFilter = [...filter, {
          id: filter.length + 1,
          logicalOperator: 'OR',
          prefix: key === 'O' ? 'DONDE' : 'DONDE NO',
          eval: [newOrEval]
        }]
        break;
      default:
        alert('ERROR: FILTER UNSUPPORT');
        break;
    }

    console.log({newFilter}, 'ADD_FILTER');
    this.filter$.next(newFilter);
  }

  private getNewIndexId() {
    const filter = this.filter$.getValue();
    return filter.reduce((a, b) => a + b.eval.length, 0) + 1
  }

  private createFilterEvaluation(key: string, logicalOperator: 'OR' | 'AND', column: SnFilterColumn): SnFilterEvaluation {
    return {
      id: this.getNewIndexId(),
      logicalOperator,
      prefix: (key === 'SI' || key === 'O') ? 'DONDE' : 'DONDE NO',
      operator: (column.type || 'text') === 'text' ? 'contiene' : '=',
      title: column.title,
      field: column.field,
      type: column.type || 'text',
      value1: '',
      value2: ''
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
