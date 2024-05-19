

import { NgModule } from '@angular/core';

import { NzI18nPipe } from './nz-i18n.pipe';

@NgModule({
  imports: [NzI18nPipe],
  exports: [NzI18nPipe]
})
export class NzI18nModule {}
