import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-border-less',
  template: `
    <sn-select ngModel="lucy" nzBorderless>
      <sn-option nzValue="jack" nzLabel="Jack"></sn-option>
      <sn-option nzValue="lucy" nzLabel="Lucy"></sn-option>
      <sn-option nzValue="disabled" nzLabel="Disabled" nzDisabled></sn-option>
    </sn-select>
    <sn-select ngModel="lucy" nzDisabled nzBorderless>
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
export class NzDemoSelectBorderLessComponent {}
