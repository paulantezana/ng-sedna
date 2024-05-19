import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-border-less',
  template: `
    <sn-select ngModel="lucy" nzBorderless>
      <nz-option nzValue="jack" nzLabel="Jack"></nz-option>
      <nz-option nzValue="lucy" nzLabel="Lucy"></nz-option>
      <nz-option nzValue="disabled" nzLabel="Disabled" nzDisabled></nz-option>
    </sn-select>
    <sn-select ngModel="lucy" nzDisabled nzBorderless>
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
export class NzDemoSelectBorderLessComponent {}
