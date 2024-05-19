

import { OverlayRef } from '@angular/cdk/overlay';

export function overlayZIndexSetter(overlayRef: OverlayRef, zIndex?: number): void {
  if (!zIndex) return;

  (overlayRef['_host'] as HTMLElement).style.zIndex = `${zIndex}`;
}
