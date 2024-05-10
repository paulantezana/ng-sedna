/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ngx-sedna/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  Optional,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { NzDestroyService } from 'ngx-sedna/core/services';
import { BooleanInput, NzSafeAny } from 'ngx-sedna/core/types';
import { InputBoolean } from 'ngx-sedna/core/util';

import { NzOptionGroupComponent } from './option-group.component';

@Component({
  selector: 'nz-option',
  exportAs: 'nzOption',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NzDestroyService],
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
  standalone: true
})
export class NzOptionComponent implements OnChanges, OnInit {
  static ngAcceptInputType_nzDisabled: BooleanInput;
  static ngAcceptInputType_nzHide: BooleanInput;
  static ngAcceptInputType_nzCustomContent: BooleanInput;

  changes = new Subject<void>();
  groupLabel: string | number | TemplateRef<NzSafeAny> | null = null;
  @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<NzSafeAny>;
  @Input() nzTitle?: string | number | null;
  @Input() nzLabel: string | number | null = null;
  @Input() nzValue: NzSafeAny | null = null;
  @Input() nzKey?: string | number;
  @Input() @InputBoolean() nzDisabled = false;
  @Input() @InputBoolean() nzHide = false;
  @Input() @InputBoolean() nzCustomContent = false;

  constructor(
    @Optional() private nzOptionGroupComponent: NzOptionGroupComponent,
    private destroy$: NzDestroyService
  ) {}

  ngOnInit(): void {
    if (this.nzOptionGroupComponent) {
      this.nzOptionGroupComponent.changes.pipe(startWith(true), takeUntil(this.destroy$)).subscribe(() => {
        this.groupLabel = this.nzOptionGroupComponent.nzLabel;
      });
    }
  }

  ngOnChanges(): void {
    this.changes.next();
  }
}