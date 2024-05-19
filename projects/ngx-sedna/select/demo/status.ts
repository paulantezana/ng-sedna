import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-select-status',
  template: `
    <nz-space nzDirection="vertical" style="width: 100%">
      <sn-select *nzSpaceItem nzStatus="error" style="width: 100%"></sn-select>
      <sn-select *nzSpaceItem nzStatus="warning" style="width: 100%"></sn-select>
    </nz-space>
  `
})
export class NzDemoSelectStatusComponent {}
