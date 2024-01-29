import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnDataTableComponent } from './data-table/data-table.component';
import { SnThAddOnComponent } from './cell/th-addon.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SnDataTableComponent,
    SnThAddOnComponent,
  ],
  exports: [
    SnDataTableComponent,
    SnThAddOnComponent,
  ]
})
export class SnDataTableModule { }
