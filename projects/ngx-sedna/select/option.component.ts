

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

import { SnDestroyService } from 'ngx-sedna/core/services';
import { BooleanInput, SnSafeAny } from 'ngx-sedna/core/types';
import { InputBoolean } from 'ngx-sedna/core/util';

import { SnOptionGroupComponent } from './option-group.component';

@Component({
  selector: 'sn-option',
  exportAs: 'snOption',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SnDestroyService],
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
  standalone: true
})
export class SnOptionComponent implements OnChanges, OnInit {
  static ngAcceptInputType_nzDisabled: BooleanInput;
  static ngAcceptInputType_nzHide: BooleanInput;
  static ngAcceptInputType_nzCustomContent: BooleanInput;

  changes = new Subject<void>();
  groupLabel: string | number | TemplateRef<SnSafeAny> | null = null;
  @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<SnSafeAny>;
  @Input() nzTitle?: string | number | null;
  @Input() nzLabel: string | number | null = null;
  @Input() nzValue: SnSafeAny | null = null;
  @Input() nzKey?: string | number;
  @Input() @InputBoolean() nzDisabled = false;
  @Input() @InputBoolean() nzHide = false;
  @Input() @InputBoolean() nzCustomContent = false;

  constructor(
    @Optional() private nzOptionGroupComponent: SnOptionGroupComponent,
    private destroy$: SnDestroyService
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
