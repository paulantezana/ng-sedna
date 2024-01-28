import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SnInputDirective } from '../input';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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
    SnInputDirective,
    FontAwesomeModule
  ]
})
export class SnPaginationComponent {
  @Input() pageSizeOptions: number[] = [];
  @Input() length: number = 0;
  @Input() pageSize: number = 20;
  @Input() pageIndex: number = 1;

  @Output() pageChange = new EventEmitter<paginationData>();

  itemQuantity: number = 1;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;

  get totalPages(): number {
    return Math.ceil(this.length / this.pageSize);
  }

  get showPrevious(): boolean {
    return this.pageIndex > 1;
  }

  get showNext(): boolean {
    return this.pageIndex < this.totalPages;
  }

  get startPage() {
    return ((this.pageIndex - this.itemQuantity) > 0) ? this.pageIndex - this.itemQuantity : 1
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
