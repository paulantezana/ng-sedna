import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { SnFormModule } from '../form';
import { SnInputDirective } from '../input';
import { SnButtonDirective } from '../button';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SnFilter, SnFilterColumn, SnFilterEvaluation, SnFilterNumericOperator, SnFilterPrefix, SnFilterStringOperator } from './filter.types';
import { SnFilterService } from './filter.service';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'sn-filter',
  standalone: true,
  providers: [SnFilterService],
  imports: [
    CommonModule,
    SnFormModule,
    SnInputDirective,
    // MatDatepickerModule,
    SnButtonDirective,
    CdkMenuModule,
  ],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class SnFilterComponent {
  private snFilterService = inject(SnFilterService);
  private destroy$ = new Subject<void>();

  @Input() snFilter: SnFilter[] = [];
  @Input() snFilterColumns: SnFilterColumn[] = [];

  @Output() readonly snFilterChange = new EventEmitter<SnFilter[]>();

  prefixData: SnFilterPrefix[] = [
    { id: 'DONDE', description: 'Donde' },
    { id: 'DONDE NO', description: 'Donde No' },
  ];

  stringOperatorArray: SnFilterStringOperator[] = [
    { id: 'contiene', description: 'contiene' },
    { id: 'empieza por', description: 'empieza por' },
    { id: 'es', description: 'es' },
    { id: 'no es', description: 'no es' },
    { id: 'no contiene', description: 'no contiene' },
    { id: 'se encuentra entre (incluye)', description: 'se encuentra entre (incluye)' },
    { id: 'es mayor que e incluye', description: 'es mayor que e incluye' },
    { id: 'es menor que e incluye', description: 'es menor que e incluye' },
    { id: 'no tiene valor.', description: 'no tiene valor.' },
  ];

  numericOperatorArray: SnFilterNumericOperator[] = [
    { id: '=', description: '=' },
    { id: '<>', description: '<>' },
    { id: 'se encuentra entre (incluye)', description: 'se encuentra entre (incluye)' },
    { id: '<', description: '<' },
    { id: '<=', description: '<=' },
    { id: '>', description: '>' },
    { id: '>=', description: '>=' },
    { id: 'no tiene valor', description: 'no tiene valor' },
  ];

  ngOnInit(): void {
    const { filterDistinct$, filterParams$ } = this.snFilterService;
    filterParams$.pipe(takeUntil(this.destroy$)).subscribe(this.snFilterChange);
    filterDistinct$.pipe(takeUntil(this.destroy$)).subscribe(filter => {
      if (JSON.stringify(filter) !== JSON.stringify(this.snFilter)) {
        this.snFilter = filter;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { snFilter } = changes;

    if (snFilter) {
      this.snFilter = this.snFilter || [];
      this.snFilterService.updateFilter(this.snFilter);
    }
  }

  trackByFn(index: number, item: SnFilter) {
    return item.id;
  }

  trackByFnEval(index: number, item: SnFilterEvaluation) {
    return item.id;
  }

  onRemoveFilter(id: number, parentId: number) {
    this.snFilterService.removeFilter(id, parentId);
  }

  onSelectColumn(event: Event, id: number, parentId: number) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    const currentColumn = this.snFilterColumns.find(item => item.field === selectedValue);
    const type = currentColumn?.type ?? 'text';

    this.snFilterService.updateEvalValues({
      field: selectedValue,
      type,
      operator: this.isNumberOperator(type) ? '=' : 'es',
      title: currentColumn?.title,
    }, id, parentId);
  }

  onSelectOperator(event: Event, id: number, parentId: number) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.snFilterService.updateEvalValues({
      operator: selectedValue,
    }, id, parentId);
  }

  onChangeValue1(event: any, id: number, parentId: number) {
    this.snFilterService.updateEvalValues({
      value1: event.target.value,
    }, id, parentId);
  }

  onChangeValue2(event: any, id: number, parentId: number) {
    this.snFilterService.updateEvalValues({
      value2: event.target.value,
    }, id, parentId);
  }

  onAddFilter(key: string, parentId: number) {
    this.snFilterService.addFilter(key, parentId, this.snFilterColumns);
  }

  isNumberOperator(type: string): boolean {
    return type === 'number' || type === 'date' || type === 'datetime-local'
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
