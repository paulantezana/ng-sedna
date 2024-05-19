

import { NgModule } from '@angular/core';

import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';

import { SnIconModule, SN_ICONS } from 'ngx-sedna/icon';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};

const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => {
  const i = antDesignIcons[key];
  return i;
});

/**
 * Include this module in every testing spec, except `icon.spec.ts`.
 */
// @dynamic
@NgModule({
  exports: [SnIconModule],
  providers: [
    {
      provide: SN_ICONS,
      useValue: icons
    }
  ]
})
export class SnIconTestModule {}
