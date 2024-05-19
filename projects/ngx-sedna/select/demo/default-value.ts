import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-default-value',
  template: `
    <sn-select nzMode="multiple" nzPlaceHolder="Inserted are removed" [(ngModel)]="listOfSelectedValue">
      <sn-option *ngFor="let option of listOfOption" [nzLabel]="option" [nzValue]="option"></sn-option>
      <sn-option *ngFor="let option of defaultOption" [nzLabel]="option" [nzValue]="option" nzHide></sn-option>
    </sn-select>
    <br />
    <br />
    <sn-select [(ngModel)]="selectedValue">
      <sn-option *ngFor="let option of listOfOption" [nzLabel]="option" [nzValue]="option"></sn-option>
      <sn-option nzLabel="Default Value" nzValue="Default" nzHide></sn-option>
    </sn-select>
  `,
  styles: [
    `
      sn-select {
        width: 100%;
      }
    `
  ]
})
export class NzDemoSelectDefaultValueComponent {
  listOfOption = ['Option 01', 'Option 02'];
  listOfSelectedValue = ['Default 01', 'Default 02'];
  defaultOption = [...this.listOfSelectedValue];

  selectedValue = 'Default';
}
