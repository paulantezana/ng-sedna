import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table/data-table.component';
import { SnThAddOnComponent } from './cell/th-addon.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DataTableComponent,
    SnThAddOnComponent,
  ],
  exports: [
    DataTableComponent,
    SnThAddOnComponent,
  ]
})
export class DataTableModule { }
