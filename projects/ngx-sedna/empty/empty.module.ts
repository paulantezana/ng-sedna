

import { NgModule } from '@angular/core';

import { SnEmbedEmptyComponent } from './embed-empty.component';
import { SnEmptyComponent } from './empty.component';
import { SnEmptyDefaultComponent } from './partial/default';
import { SnEmptySimpleComponent } from './partial/simple';

@NgModule({
  imports: [SnEmptyComponent, SnEmbedEmptyComponent, SnEmptyDefaultComponent, SnEmptySimpleComponent],
  exports: [SnEmptyComponent, SnEmbedEmptyComponent]
})
export class SnEmptyModule {}
