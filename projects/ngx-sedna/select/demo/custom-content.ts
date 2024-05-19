import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-custom-content',
  template: `
    <sn-select nzShowSearch nzAllowClear nzPlaceHolder="Select OS" [(ngModel)]="selectedOS">
      <sn-option nzCustomContent nzLabel="Windows" nzValue="windows">
        <span nz-icon nzType="windows"></span>
        Windows
      </sn-option>
      <sn-option nzCustomContent nzLabel="Mac" nzValue="mac">
        <span nz-icon nzType="apple"></span>
        Mac
      </sn-option>
      <sn-option nzCustomContent nzLabel="Android" nzValue="android">
        <span nz-icon nzType="android"></span>
        Android
      </sn-option>
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
export class NzDemoSelectCustomContentComponent {
  selectedOS = null;
}
