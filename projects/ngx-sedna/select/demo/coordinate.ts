import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-coordinate',
  template: `
    <div>
      <sn-select [(ngModel)]="selectedProvince" (ngModelChange)="provinceChange($event)">
        <sn-option *ngFor="let p of provinceData" [nzValue]="p" [nzLabel]="p"></sn-option>
      </sn-select>
      <sn-select [(ngModel)]="selectedCity">
        <sn-option *ngFor="let c of cityData[selectedProvince]" [nzValue]="c" [nzLabel]="c"></sn-option>
      </sn-select>
    </div>
  `,
  styles: [
    `
      sn-select {
        margin-right: 8px;
        width: 120px;
      }
    `
  ]
})
export class NzDemoSelectCoordinateComponent {
  selectedProvince = 'Zhejiang';
  selectedCity = 'Hangzhou';
  provinceData = ['Zhejiang', 'Jiangsu'];
  cityData: { [place: string]: string[] } = {
    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang']
  };

  provinceChange(value: string): void {
    this.selectedCity = this.cityData[value][0];
  }
}
