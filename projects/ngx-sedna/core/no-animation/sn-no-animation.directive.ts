

import { Directive, Input, booleanAttribute, inject } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';

@Directive({
  selector: '[snNoAnimation]',
  exportAs: 'snNoAnimation',
  standalone: true,
  host: {
    '[class.sn-animate-disabled]': `snNoAnimation || animationType === 'NoopAnimations'`
  }
})
export class SnNoAnimationDirective {
  animationType = inject(ANIMATION_MODULE_TYPE, { optional: true });
  @Input({ transform: booleanAttribute }) snNoAnimation: boolean = false;
}
