import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SnDataTableService } from '../data-table.service';
import { SnDataTableColumn, SnDataTableQueryParams } from '../data-table.types';
import { SnFilter, SnFilterColumn, SnFilterModule } from 'ngx-sedna/filter';
import { SnButtonDirective } from 'ngx-sedna/button';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faFilter, faTableColumns } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'sn-data-table-header',
  standalone: true,
  providers: [SnDataTableService],
  imports: [CommonModule, CdkMenuModule, SnButtonDirective, SnFilterModule, FontAwesomeModule],
  templateUrl: './data-table-header.component.html',
  styleUrl: './data-table-header.component.scss'
})
export class SnDataTableHeaderComponent {
  @Input() snFilter: SnFilter[] = [];
  @Input() snColumns: SnDataTableColumn[] = [];

  @Output() readonly snFilterChange = new EventEmitter<SnFilter[]>();

  protected showModal: boolean = false;
  faCheck = faCheck;
  faFilter = faFilter;
  faTableColumns = faTableColumns;

  getFilterColumn(): SnFilterColumn[] {
    return this.snColumns.filter(item => item.filterable).map(item => ({
      title: item.title,
      field: item.field,
      type: item.type
    }));
  }

  // snModalFilter: SnFilter[] = [];
  // snCurrentFilter: SnFilter[] = [];

  onFilterChange(filter: SnFilter[]) {
    console.log('========CAHGE======: ', filter);
    this.snFilterChange.emit(filter);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  removeFilter(event:Event, id: number, parentId: number){
    event.preventDefault();
    event.stopPropagation();

    const newFilter = this.snFilter.map(filter => filter.id === parentId ? ({
      ...filter,
      eval: filter.eval.filter(item => item.id !== id),
    }) : filter).filter(filter => filter.eval.length > 0);

    this.snFilter = newFilter;
  }

  closeApplyModal() {
    this.showModal = false;
  }
}
