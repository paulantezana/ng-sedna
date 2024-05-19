import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-search',
  template: `
    <sn-select nzShowSearch nzAllowClear nzPlaceHolder="Select a person" [(ngModel)]="selectedValue">
      <sn-option nzLabel="Jack" nzValue="jack"></sn-option>
      <sn-option nzLabel="Lucy" nzValue="lucy"></sn-option>
      <sn-option nzLabel="Tom" nzValue="tom"></sn-option>
    </sn-select>
  `,
  styles: [
    `
      sn-select {
        width: 200px;
      }
    `
  ]
})
export class NzDemoSelectSearchComponent {
  selectedValue = null;
}
