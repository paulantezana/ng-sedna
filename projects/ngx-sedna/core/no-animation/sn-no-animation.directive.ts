

import { Directive, Input, booleanAttribute, inject } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

@Directive({
  selector: '[nzNoAnimation]',
  exportAs: 'nzNoAnimation',
  standalone: true,
  host: {
    '[class.nz-animate-disabled]': `nzNoAnimation || animationType === 'NoopAnimations'`
  }
})
export class SnNoAnimationDirective {
  animationType = inject(ANIMATION_MODULE_TYPE, { optional: true });
  @Input({ transform: booleanAttribute }) nzNoAnimation: boolean = false;
}
