import { Component, EventEmitter, Input, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SnPaginationComponent } from '../../paginate';
import { SnDataTableService } from '../data-table.service';
import { SnDataTableColumn, SnDataTableQueryParams } from '../data-table.types';
import { Subject, takeUntil } from 'rxjs';
import { SnFilter, SnFilterColumn, SnFilterModule } from '../../filter';
import { SnDataTableHeaderComponent } from './data-table-header.component';



@Component({
  selector: 'sn-data-table',
  standalone: true,
  providers: [SnDataTableService],
  imports: [CommonModule, CdkMenuModule, SnPaginationComponent, SnFilterModule, SnDataTableHeaderComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  private snDataTableService = inject(SnDataTableService);

  private destroy$ = new Subject<void>();

  @Input() snPageSizeOptions = [10, 20, 30, 50, 100, 250, 500, 1000];
  @Input() snPageSize = 20;
  @Input() snTotal = 0;
  @Input() snPageIndex = 1;

  @Input() snFilter: SnFilter[] = [];
  @Input() snColumns: SnDataTableColumn[] = [];

  @Output() readonly snQueryParams = new EventEmitter<SnDataTableQueryParams>();

  // [pageSizeOptions]="[10,25,50,100,250,500,1000]"
  // [length]="paginate.totalLength"
  // [pageSize]="paginate.pageSize"
  // [pageIndex]="paginate.pageIndex"
  // (pageChange)="onPageChange($event)"

  // snFiler


  ngOnInit(): void {
    const { pageIndexDistinct$, pageSizeDistinct$, queryParams$, filterDistinct$ } = this.snDataTableService;

    queryParams$.pipe(takeUntil(this.destroy$)).subscribe(this.snQueryParams);

    pageIndexDistinct$.pipe(takeUntil(this.destroy$)).subscribe(pageIndex => {
      if (pageIndex !== this.snPageIndex) {
        this.snPageIndex = pageIndex;
        // this.nzPageIndexChange.next(pageIndex);
      }
    });

    pageSizeDistinct$.pipe(takeUntil(this.destroy$)).subscribe(pageSize => {
      if (pageSize !== this.snPageSize) {
        this.snPageSize = pageSize;
        // this.snPageSizeChange.next(pageSize);
      }
    });

    filterDistinct$.pipe(takeUntil(this.destroy$)).subscribe(filter => {
      console.log({ filter, KLT: this.snFilter }, 'ME_DISPARE_DESDE_LA_TABLA');
      if (JSON.stringify(filter) !== JSON.stringify(this.snFilter)) {
        this.snFilter = filter;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { snColumns, snPageSize } = changes;

    if (snColumns) {
      this.snColumns = this.snColumns || [];
      this.snDataTableService.updateColumns(this.snColumns);
    }

    if(snPageSize){
      this.snDataTableService.updatePageSize(this.snPageSize);
    }
  }

  onFilterChange(filter: SnFilter[]) {
    console.log(filter, 'CAMBIO_TABLA');
    this.snDataTableService.updateFilter(filter);
  }

  onPageChange(page: any) {
    this.snDataTableService.updatePageIndex(page.pageIndex);
    this.snDataTableService.updatePageSize(page.pageSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
