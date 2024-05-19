import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-optgroup',
  template: `
    <sn-select [(ngModel)]="selectedValue" nzAllowClear nzPlaceHolder="Choose" nzShowSearch>
      <sn-option-group nzLabel="Manager">
        <sn-option nzValue="jack" nzLabel="Jack"></sn-option>
        <sn-option nzValue="lucy" nzLabel="Lucy"></sn-option>
      </sn-option-group>
      <sn-option-group nzLabel="Engineer">
        <sn-option nzValue="tom" nzLabel="Tom"></sn-option>
      </sn-option-group>
    </sn-select>
  `,
  styles: [
    `
      sn-select {
        width: 120px;
      }
    `
  ]
})
export class NzDemoSelectOptgroupComponent {
  selectedValue = 'lucy';
}
