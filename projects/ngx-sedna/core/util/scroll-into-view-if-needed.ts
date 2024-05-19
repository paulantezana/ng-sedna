/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ngx-sedna/blob/master/LICENSE
 */

import { NzSafeAny } from 'ngx-sedna/core/types';

export function scrollIntoView(node: HTMLElement): void {
  const nodeAsAny = node as NzSafeAny;
  if (nodeAsAny.scrollIntoViewIfNeeded) {
    /* eslint-disable-next-line @typescript-eslint/dot-notation */
    nodeAsAny.scrollIntoViewIfNeeded(false);
    return;
  }
  if (node.scrollIntoView) {
    node.scrollIntoView(false);
    return;
  }
}
