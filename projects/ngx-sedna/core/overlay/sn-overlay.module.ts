import { NgModule } from '@angular/core';

import { SnConnectedOverlayDirective } from './sn-connected-overlay';

@NgModule({
  declarations: [SnConnectedOverlayDirective],
  exports: [SnConnectedOverlayDirective]
})
export class SnOverlayModule {}
