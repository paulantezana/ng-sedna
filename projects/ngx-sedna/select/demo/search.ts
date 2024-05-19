import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-search',
  template: `
    <sn-select nzShowSearch nzAllowClear nzPlaceHolder="Select a person" [(ngModel)]="selectedValue">
      <nz-option nzLabel="Jack" nzValue="jack"></nz-option>
      <nz-option nzLabel="Lucy" nzValue="lucy"></nz-option>
      <nz-option nzLabel="Tom" nzValue="tom"></nz-option>
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
