import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-basic',
  template: `
    <sn-select ngModel="lucy">
      <sn-option nzValue="jack" nzLabel="Jack"></sn-option>
      <sn-option nzValue="lucy" nzLabel="Lucy"></sn-option>
      <sn-option nzValue="disabled" nzLabel="Disabled" nzDisabled></sn-option>
    </sn-select>
    <sn-select ngModel="lucy" nzDisabled>
      <sn-option nzValue="lucy" nzLabel="Lucy"></sn-option>
    </sn-select>
    <sn-select ngModel="lucy" nzLoading>
      <sn-option nzValue="lucy" nzLabel="Lucy"></sn-option>
    </sn-select>
    <sn-select ngModel="lucy" nzAllowClear nzPlaceHolder="Choose">
      <sn-option nzValue="lucy" nzLabel="Lucy"></sn-option>
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
