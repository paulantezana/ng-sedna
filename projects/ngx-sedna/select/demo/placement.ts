import { Component } from '@angular/core';

import { SnSelectPlacementType } from 'ngx-sedna/select';

@Component({
  selector: 'nz-demo-select-placement',
  template: `
    <nz-radio-group [(ngModel)]="placement">
      <label nz-radio-button nzValue="topLeft">topLeft</label>
      <label nz-radio-button nzValue="topRight">topRight</label>
      <label nz-radio-button nzValue="bottomLeft">bottomLeft</label>
      <label nz-radio-button nzValue="bottomRight">bottomRight</label>
    </nz-radio-group>
    <br />
    <br />
    <sn-select [(ngModel)]="selectedValue" [nzDropdownMatchSelectWidth]="false" [nzPlacement]="placement">
      <sn-option nzValue="HangZhou" nzLabel="HangZhou #310000"></sn-option>
      <sn-option nzValue="NingBo" nzLabel="NingBo #315000"></sn-option>
      <sn-option nzValue="WenZhou" nzLabel="WenZhou #325000"></sn-option>
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
export class NzDemoSelectPlacementComponent {
  placement: SnSelectPlacementType = 'topLeft';
  selectedValue = 'HangZhou';
}
