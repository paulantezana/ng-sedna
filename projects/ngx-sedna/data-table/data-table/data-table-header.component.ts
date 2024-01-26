import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SnDataTableService } from '../data-table.service';
import { SnDataTableColumn, SnDataTableQueryParams } from '../data-table.types';
import { SnFilter, SnFilterColumn, SnFilterModule } from '../../filter';
import { SnButtonDirective } from '../../button';



@Component({
  selector: 'sn-data-table-header',
  standalone: true,
  providers: [SnDataTableService],
  imports: [CommonModule, CdkMenuModule, SnButtonDirective, SnFilterModule],
  templateUrl: './data-table-header.component.html',
  styleUrl: './data-table-header.component.scss'
})
export class SnDataTableHeaderComponent {
  @Input() snFilter: SnFilter[] = [];
  @Input() snColumns: SnDataTableColumn[] = [];

  @Output() readonly snFilterChange = new EventEmitter<SnFilter[]>();

  protected showModal: boolean = false;

  getFilterColumn(): SnFilterColumn[] {
    return this.snColumns.filter(item => item.filterable).map(item => ({
      title: item.title,
      field: item.field,
      type: item.type
    }));
  }

  onFilterChange(filter: SnFilter[]) {
    // this.snFilterChange
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
