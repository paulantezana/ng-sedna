import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnFormModule } from '../../../ngx-sedna/form';
import { SnInputDirective } from '../../../ngx-sedna/input';
import { SnButtonDirective } from '../../../ngx-sedna/button';
import { DataTableComponent, DataTableModule, SnDataTableQueryParams, SnThAddOnComponent } from '../../../ngx-sedna/data-table';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SnFilter, SnFilterColumn, SnFilterModule } from '../../../ngx-sedna/filter';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, SnButtonDirective, SnInputDirective, SnFormModule,
    DataTableComponent,
    DataTableModule,
    SnThAddOnComponent,
    CdkMenuModule,
    SnFilterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'showcase';

  filter:SnFilter[] = []
  columns: SnFilterColumn[] = [
    { title: 'Nombre', field: 'name', type: 'text' },
    { title: 'Edad', field: 'age', type: 'number' }
  ]


  form: FormGroup = this.getFormFields();

  constructor(
    private formBuilder: FormBuilder,
  ) {

  }

  private getFormFields() {
    return this.formBuilder.group({
      number: ['', Validators.required],
      serie: ['', Validators.required],
    });
  }

  onQueryParamsChange(params: SnDataTableQueryParams){
    console.log(params, 'CAMBIOOOOO');
  }
}
