/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ngx-sedna/blob/master/LICENSE
 */

import { NgModule } from '@angular/core';

import { NzNoAnimationDirective } from './nz-no-animation.directive';

@NgModule({
  imports: [NzNoAnimationDirective],
  exports: [NzNoAnimationDirective]
})
export class NzNoAnimationModule {}
