import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { SnFormModule } from '../form';
import { SnInputDirective } from '../input';
import { SnButtonDirective } from '../button';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SnFilter, SnFilterColumn, SnFilterEvaluation, SnFilterNumericOperator, SnFilterPrefix, SnFilterStringOperator } from './filter.types';

@Component({
  selector: 'sn-filter',
  standalone: true,
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
  @Input() snFilters: SnFilter[] = [];
  @Input() snFilterColumns: SnFilterColumn[] = [];

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

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes, '_CAMBIOS_');
    // if (changes.snFilterColumns) {
    //   // Aquí puedes realizar las acciones que necesites cuando la propiedad 'snFilterColumns' cambie.
    //   // Por ejemplo, puedes imprimir los cambios en la consola para depurar:
    //   console.log('Cambios en la propiedad "snFilterColumns":', changes.snFilterColumns);
    // }
  }

  trackByFn(index: number, item: SnFilter) {
    return item.id;
  }

  trackByFnEval(index: number, item: SnFilterEvaluation) {
    return item.id;
  }

  onRemoveFilter(id: number, parentId: number) {
    const indexParent = this.snFilters.findIndex(item => item.id === parentId);
    if (indexParent === -1) {
      alert('ERROR: FIND FILTER PARENT INDEX');
    }

    this.snFilters[indexParent].eval = this.snFilters[indexParent].eval.filter(item => item.id !== id);
    if (this.snFilters[indexParent].eval.length === 0) {
      this.snFilters.splice(indexParent, 1);
    }
  }

  onSelectColumn(event: Event, id: number, parentId: number) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    const currentColumn = this.snFilterColumns.find(item => item.field === selectedValue);
    const type = currentColumn?.type ?? 'text';

    this.updateCustomFilter({
      field: selectedValue,
      type,
      operator: this.isNumberOperator(type) ? '=' : 'es',
      title: currentColumn?.title,
    }, id, parentId);
  }

  onSelectOperator(event: Event, id: number, parentId: number) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.updateCustomFilter({
      operator: selectedValue,
    }, id, parentId);
  }

  onChangeValue1(event: any, id: number, parentId: number) {
    this.updateCustomFilter({
      value1: event.target.value,
    }, id, parentId);
  }

  onChangeValue2(event: any, id: number, parentId: number) {
    this.updateCustomFilter({
      value2: event.target.value,
    }, id, parentId);
  }

  onAddFilter(key: string, parentId: number) {
    console.log(this.snFilters, 'FILTROSSSSSSSSSSSSSSSSSSS');

    const firstColumn = this.snFilterColumns[0];
    if (firstColumn === undefined) {
      alert('ERROR: Filter add snFilterColumns not found');
      return;
    }

    switch (key) {
      case 'SI': // Si
      case 'SI_NO': // Si no
        const indexMatch = this.snFilters.findIndex(item => item.id === parentId);
        const newfilter: SnFilterEvaluation = {
          id: this.getNewIndexId(),
          logicalOperator: 'AND',
          prefix: key === 'SI' ? 'DONDE' : 'DONDE NO',
          operator: (firstColumn.type || 'text') === 'text' ? 'contiene' : '=',
          title: firstColumn.title,
          field: firstColumn.field,
          type: firstColumn.type || 'text',
          value1: '',
          value2: ''
        };

        if (indexMatch === -1) {
          this.snFilters.push({
            id: this.snFilters.length + 1,
            logicalOperator: 'AND',
            prefix: key === 'SI' ? 'DONDE' : 'DONDE NO',
            eval: [newfilter]
          });
        } else {
          this.snFilters[indexMatch].eval = [...this.snFilters[indexMatch].eval, newfilter];
        }
        break;
      case 'O': // o
      case 'O_NO': // o no
        const filterEval: SnFilterEvaluation = {
          id: this.getNewIndexId(),
          logicalOperator: 'OR',
          prefix: key === 'O' ? 'DONDE' : 'DONDE NO',
          operator: (firstColumn.type || 'text') === 'text' ? 'contiene' : '=',
          title: firstColumn.title,
          field: firstColumn.field,
          type: firstColumn.type || 'text',
          value1: '',
          value2: ''
        };
        this.snFilters.push({
          id: this.snFilters.length + 1,
          logicalOperator: 'OR',
          prefix: key === 'O' ? 'DONDE' : 'DONDE NO',
          eval: [filterEval]
        });
        break;
      default:
        alert('ERROR: FILTER UNSUPPORT');
        break;
    }
  }

  private updateCustomFilter(newValues: any, id: number, parentId: number) {
    const indexParent = this.snFilters.findIndex(item => item.id === parentId);
    if (indexParent === -1) {
      alert('ERROR: FILTER UPDATE');
    }

    this.snFilters[indexParent].eval = this.snFilters[indexParent].eval.map(item => item.id == id ? ({ ...item, ...newValues }) : item);
  }

  private getNewIndexId() {
    return this.snFilters.reduce((a, b) => a + b.eval.length, 0) + 1
  }

  isNumberOperator(type: string): boolean {
    return type === 'number' || type === 'date' || type === 'datetime-local'
  }
}
