import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { SnFormModule } from 'ngx-sedna/form';
import { SnInputDirective } from 'ngx-sedna/input';
import { SnButtonDirective } from 'ngx-sedna/button';
import { SnDataTableComponent, SnDataTableModule, SnDataTableColumn, SnDataTableQueryParams, SnThAddOnComponent } from 'ngx-sedna/data-table';
import { CdkMenuModule } from '@angular/cdk/menu';
import { SnFilter, SnFilterColumn, SnFilterModule } from 'ngx-sedna/filter';
import { ApiService } from './services/api.service';
import { HttpClient } from '@angular/common/http';
import { SnSelectModule } from 'ngx-sedna/select';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterOutlet, SnButtonDirective, SnInputDirective, SnFormModule,
    SnDataTableComponent,
    SnDataTableModule,
    SnThAddOnComponent,
    CdkMenuModule,
    SnFilterModule,
    SnSelectModule,
    // NgForm,
    ReactiveFormsModule,
    // BrowserAnimationsModule,
    // NoopAnimationsModule,
  ],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  validateForm: FormGroup<{
    note: FormControl<string | null>;
    gender: FormControl<'male' | 'male' | null>;
  }> = this.fb.group({
    note: this.fb.control<string | null>(null, Validators.required),
    gender: this.fb.control<'male' | 'male' | null>(null, Validators.required)
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  genderChange(value: string): void {
    this.validateForm.controls.note.setValue(value === 'male' ? 'Hi, man!' : 'Hi, lady!');
  }

  constructor(private fb: FormBuilder) {}

  // title = 'showcase';

  // pageSize = 30;
  // total = 0;
  // pageIndex = 1;

  // filter: SnFilter[] = []
  // columns: SnFilterColumn[] = [
  //   { title: 'Nombre', field: 'name', type: 'text' },
  //   { title: 'Edad', field: 'age', type: 'number' }
  // ]

  // listOfOption: string[] = [];
  // listOfSelectedValue = ['a10', 'c12'];

  // dataColumns: SnDataTableColumn[] = [
  //   {
  //     title: 'Logo',
  //     field: 'logo',
  //     filterable: false,
  //     sortable: false,
  //     visible: true,
  //     // customRender: (item) => {
  //     //   return `<div class="SnAvatar" style="width: 28px; height: 28px;">
  //     //                         ${item.logo !== '' ? `<img class="SnAvatar-img" src="${STORAGE_PUBLIC_URL}${item.logo}" alt="avatar">` : `<div class="SnAvatar-text">${item.commercial_reason.substring(0, 2)}</div>`}
  //     //                     </div>`;
  //     // }
  //   },
  //   {
  //     title: 'RUC',
  //     field: 'document_number',
  //     filterable: true,
  //     sortable: true,
  //     visible: true,
  //   },
  //   {
  //     title: 'Nombre comercial',
  //     field: 'commercial_reason',
  //     filterable: true,
  //     sortable: true,
  //     visible: true,
  //   },
  //   {
  //     title: 'Razón social',
  //     field: 'social_reason',
  //     filterable: true,
  //     sortable: true,
  //     visible: true,
  //   },
  //   {
  //     title: 'Dirección',
  //     field: 'fiscal_address',
  //     filterable: true,
  //     sortable: true,
  //     visible: true,
  //   },
  //   {
  //     title: 'Reprecentante',
  //     field: 'representative',
  //     filterable: true,
  //     sortable: true,
  //     visible: true,
  //   },
  //   {
  //     title: 'Telefono',
  //     field: 'phone',
  //     filterable: true,
  //     sortable: true,
  //     visible: true,
  //   },
  //   {
  //     title: 'Email',
  //     field: 'email',
  //     filterable: true,
  //     sortable: true,
  //     visible: true,
  //   },
  // ]

  // tableData :any[] = [];


  // form: FormGroup = this.getFormFields();

  // constructor(
  //   private formBuilder: FormBuilder,
  //   private apiService: ApiService,
  // ) {

  // }

  // ngOnInit(): void {
  //   this.loadFromServer({
  //     pageIndex: 1,
  //     pageSize: 30,
  //     filter: [],
  //     sorter: []
  //   })

  //   const children: string[] = [];
  //   for (let i = 10; i < 36; i++) {
  //     children.push(`${i.toString(36)}${i}`);
  //   }
  //   this.listOfOption = children;
  // }

  // private getFormFields() {
  //   return this.formBuilder.group({
  //     number: ['', Validators.required],
  //     serie: ['', Validators.required],
  //   });
  // }

  // loadFromServer(data: any) {
  //   this.apiService.post('/paginate', data).subscribe({
  //     next: res => {
  //       console.log(res);
  //       this.pageSize = res.result.pageSize;
  //       this.total = res.result.totalLength;
  //       this.pageIndex = res.result.pageIndex;

  //       // this.
  //       this.tableData = res.result.data;
  //     }
  //   })
  // }

  // onQueryParamsChange(params: SnDataTableQueryParams) {
  //   this.loadFromServer(params);
  //   console.log(params, '🖥️: Query Server');
  // }
}
