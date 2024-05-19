import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-default-value',
  template: `
    <sn-select nzMode="multiple" nzPlaceHolder="Inserted are removed" [(ngModel)]="listOfSelectedValue">
      <nz-option *ngFor="let option of listOfOption" [nzLabel]="option" [nzValue]="option"></nz-option>
      <nz-option *ngFor="let option of defaultOption" [nzLabel]="option" [nzValue]="option" nzHide></nz-option>
    </sn-select>
    <br />
    <br />
    <sn-select [(ngModel)]="selectedValue">
      <nz-option *ngFor="let option of listOfOption" [nzLabel]="option" [nzValue]="option"></nz-option>
      <nz-option nzLabel="Default Value" nzValue="Default" nzHide></nz-option>
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
