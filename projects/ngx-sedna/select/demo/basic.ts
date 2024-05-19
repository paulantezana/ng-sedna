import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-basic',
  template: `
    <sn-select ngModel="lucy">
      <nz-option nzValue="jack" nzLabel="Jack"></nz-option>
      <nz-option nzValue="lucy" nzLabel="Lucy"></nz-option>
      <nz-option nzValue="disabled" nzLabel="Disabled" nzDisabled></nz-option>
    </sn-select>
    <sn-select ngModel="lucy" nzDisabled>
      <nz-option nzValue="lucy" nzLabel="Lucy"></nz-option>
    </sn-select>
    <sn-select ngModel="lucy" nzLoading>
      <nz-option nzValue="lucy" nzLabel="Lucy"></nz-option>
    </sn-select>
    <sn-select ngModel="lucy" nzAllowClear nzPlaceHolder="Choose">
      <nz-option nzValue="lucy" nzLabel="Lucy"></nz-option>
    </sn-select>
  `,
  styles: [
    `
      sn-select {
        margin: 0 8px 10px 0;
        width: 120px;
      }
    `
  ]
})
export class NzDemoSelectBasicComponent {}
