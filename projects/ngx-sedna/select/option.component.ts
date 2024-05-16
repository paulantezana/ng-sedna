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
  static ngAcceptInputType_snDisabled: BooleanInput;
  static ngAcceptInputType_snHide: BooleanInput;
  static ngAcceptInputType_snCustomContent: BooleanInput;

  changes = new Subject<void>();
  groupLabel: string | number | TemplateRef<SnSafeAny> | null = null;
  @ViewChild(TemplateRef, { static: true }) template!: TemplateRef<SnSafeAny>;
  @Input() snTitle?: string | number | null;
  @Input() snLabel: string | number | null = null;
  @Input() snValue: SnSafeAny | null = null;
  @Input() snKey?: string | number;
  @Input() @InputBoolean() snDisabled = false;
  @Input() @InputBoolean() snHide = false;
  @Input() @InputBoolean() snCustomContent = false;

  constructor(
    @Optional() private snOptionGroupComponent: SnOptionGroupComponent,
    private destroy$: SnDestroyService
  ) {}

  ngOnInit(): void {
    if (this.snOptionGroupComponent) {
      this.snOptionGroupComponent.changes.pipe(startWith(true), takeUntil(this.destroy$)).subscribe(() => {
        this.groupLabel = this.snOptionGroupComponent.snLabel;
      });
    }
  }

  ngOnChanges(): void {
    this.changes.next();
  }
}
