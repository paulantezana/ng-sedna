import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-custom-template',
  template: `
    <sn-select nzAllowClear nzPlaceHolder="Select OS" [nzCustomTemplate]="defaultTemplate">
      <sn-option nzLabel="Windows" nzValue="windows"></sn-option>
      <sn-option nzLabel="Apple" nzValue="apple"></sn-option>
      <sn-option nzLabel="Android" nzValue="android"></sn-option>
    </sn-select>
    <ng-template #defaultTemplate let-selected>
      <span nz-icon [nzType]="selected.nzValue"></span>
      {{ selected.nzLabel }}
    </ng-template>
    <br />
    <br />
    <sn-select nzAllowClear nzPlaceHolder="Select OS" nzMode="multiple" [nzCustomTemplate]="multipleTemplate">
      <sn-option nzLabel="Windows" nzValue="windows"></sn-option>
      <sn-option nzLabel="Apple" nzValue="apple"></sn-option>
      <sn-option nzLabel="Android" nzValue="android"></sn-option>
    </sn-select>
    <ng-template #multipleTemplate let-selected>
      <div class="ant-select-selection-item-content">
        <span nz-icon [nzType]="selected.nzValue"></span>
        {{ selected.nzLabel }}
      </div>
    </ng-template>
  `,
  styles: [
    `
      sn-select {
        width: 100%;
      }
    `
  ]
})
export class NzDemoSelectCustomTemplateComponent {}
