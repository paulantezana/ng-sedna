import { SnSafeAny } from 'ngx-sedna/core/types';

export function scrollIntoView(node: HTMLElement): void {
  const nodeAsAny = node as SnSafeAny;
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
