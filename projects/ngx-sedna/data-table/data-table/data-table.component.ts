import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SnPaginationComponent } from '../../paginate';
import { SnDataTableService } from '../data-table.service';
import { SnDataTableQueryParams } from '../data-table.types';
import { Subject, takeUntil } from 'rxjs';



@Component({
  selector: 'sn-data-table',
  standalone: true,
  providers: [SnDataTableService],
  imports: [CommonModule, CdkMenuModule, SnPaginationComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  private snDataTableService = inject(SnDataTableService);

  private destroy$ = new Subject<void>();


  @Input() snPageSizeOptions = [10, 25, 50, 100, 250, 500, 1000];
  @Input() snPageSize = 10;
  @Input() snTotal = 0;
  @Input() snPageIndex = 1;

  @Output() readonly snQueryParams = new EventEmitter<SnDataTableQueryParams>();

  // [pageSizeOptions]="[10,25,50,100,250,500,1000]"
  // [length]="paginate.totalLength"
  // [pageSize]="paginate.pageSize"
  // [pageIndex]="paginate.pageIndex"
  // (pageChange)="onPageChange($event)"


  ngOnInit(): void {
    const { pageIndexDistinct$, pageSizeDistinct$, queryParams$ } = this.snDataTableService;

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
  }

  onPageChange(page:any){
    this.snDataTableService.updatePageIndex(page.pageIndex);
    this.snDataTableService.updatePageSize(page.pageSize);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
