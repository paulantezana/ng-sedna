

import { NgModule } from '@angular/core';

import { SnI18nPipe } from './sn-i18n.pipe';

@NgModule({
  imports: [SnI18nPipe],
  exports: [SnI18nPipe]
})
export class SnI18nModule {}
