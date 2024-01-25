import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { SnButtonDirective } from '../button';
import { SnInputDirective } from '../input';

export interface paginationData {
  pageSize: number,
  pageIndex: number,
}

@Component({
  standalone: true,
  selector: 'sn-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  imports: [
    CommonModule,
    SnInputDirective
  ]
})
export class SnPaginationComponent {
  @Input() pageSizeOptions: number[] = [];
  @Input() length: number = 0;
  @Input() pageSize: number = 0;
  @Input() pageIndex: number = 0;

  @Output() pageChange = new EventEmitter<paginationData>();

  itemQuantity: number = 1;

  get totalPages(): number {
    return Math.ceil(this.length / this.pageSize) - 1;
  }

  get showPrevious(): boolean {
    return this.pageIndex > 0;
  }

  get showNext(): boolean {
    return this.pageIndex < this.totalPages;
  }

  get startPage() {
    return ((this.pageIndex - this.itemQuantity) > 0) ? this.pageIndex - this.itemQuantity : 0
  }

  get endPage() {
    return ((this.pageIndex + this.itemQuantity) < this.totalPages) ? this.pageIndex + this.itemQuantity : this.totalPages
  }

  get pages(): number[] {
    const pages = [];

    for (let i = this.startPage; i <= this.endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  emitEvent() {
    this.pageChange.emit({ pageIndex: this.pageIndex, pageSize: this.pageSize });
  }

  navigateToPage(pageIndex: number) {
    this.pageIndex = pageIndex;

    this.emitEvent();
  }

  onChangePageSize(event: Event): void {
    const selectedValue = parseInt((event.target as HTMLSelectElement).value ?? 10);
    this.pageSize = selectedValue;

    this.emitEvent();
  }
}
