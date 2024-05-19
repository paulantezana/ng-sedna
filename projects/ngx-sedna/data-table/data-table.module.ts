import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnDataTableComponent } from './data-table/data-table.component';
import { anthAddOnComponent } from './cell/th-addon.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SnDataTableComponent,
    anthAddOnComponent,
  ],
  exports: [
    SnDataTableComponent,
    anthAddOnComponent,
  ]
})
export class SnDataTableModule { }
