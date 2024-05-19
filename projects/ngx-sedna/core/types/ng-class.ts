/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ngx-sedna/blob/master/LICENSE
 */

import { NzSafeAny } from './any';

export type NgClassType = string | string[] | Set<string> | NgClassInterface;

export interface NgClassInterface {
  [klass: string]: NzSafeAny;
}

export interface NgStyleInterface {
  [klass: string]: NzSafeAny;
}
