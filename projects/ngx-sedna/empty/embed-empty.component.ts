import { ComponentPortal, Portal, PortalModule, TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  Type,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import { SnConfigService } from 'ngx-sedna/core/config';
import { SnSafeAny } from 'ngx-sedna/core/types';

import { SN_EMPTY_COMPONENT_NAME, SnEmptyCustomContent, SnEmptySize } from './config';
import { SnEmptyComponent } from './empty.component';

function getEmptySize(componentName: string): SnEmptySize {
  switch (componentName) {
    case 'table':
    case 'list':
      return 'normal';
    case 'select':
    case 'tree-select':
    case 'cascader':
    case 'transfer':
      return 'small';
    default:
      return '';
  }
}

type SnEmptyContentType = 'component' | 'template' | 'string';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'sn-embed-empty',
  exportAs: 'snEmbedEmpty',
  template: `
    @if (content) {
      @if (contentType === 'string') {
        {{ content }}
      } @else {
        <ng-template [cdkPortalOutlet]="contentPortal" />
      }
    } @else {
      @if (specificContent !== null) {
        @switch (size) {
          @case ('normal') {
            <sn-empty class="ant-empty-normal" snNotFoundImage="simple" />
          }
          @case ('small') {
            <sn-empty class="ant-empty-small" snNotFoundImage="simple" />
          }
          @default {
            <sn-empty />
          }
        }
      }
    }
  `,
  imports: [SnEmptyComponent, PortalModule],
  standalone: true
})
export class SnEmbedEmptyComponent implements OnChanges, OnInit, OnDestroy {
  @Input() snComponentName?: string;
  @Input() specificContent?: SnEmptyCustomContent;

  content?: SnEmptyCustomContent;
  contentType: SnEmptyContentType = 'string';
  contentPortal?: Portal<SnSafeAny>;
  size: SnEmptySize = '';

  private destroy$ = new Subject<void>();

  constructor(
    private configService: SnConfigService,
    private viewContainerRef: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { snComponentName, specificContent } = changes;
    if (snComponentName) {
      this.size = getEmptySize(snComponentName.currentValue);
    }

    if (specificContent && !specificContent.isFirstChange()) {
      this.content = specificContent.currentValue;
      this.renderEmpty();
    }
  }

  ngOnInit(): void {
    this.subscribeDefaultEmptyContentChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private renderEmpty(): void {
    const content = this.content;

    if (typeof content === 'string') {
      this.contentType = 'string';
    } else if (content instanceof TemplateRef) {
      const context = { $implicit: this.snComponentName } as SnSafeAny;
      this.contentType = 'template';
      this.contentPortal = new TemplatePortal(content, this.viewContainerRef, context);
    } else if (content instanceof Type) {
      const injector = Injector.create({
        parent: this.injector,
        providers: [{ provide: SN_EMPTY_COMPONENT_NAME, useValue: this.snComponentName }]
      });
      this.contentType = 'component';
      this.contentPortal = new ComponentPortal(content, this.viewContainerRef, injector);
    } else {
      this.contentType = 'string';
      this.contentPortal = undefined;
    }

    this.cdr.detectChanges();
  }

  private subscribeDefaultEmptyContentChange(): void {
    this.configService
      .getConfigChangeEventForComponent('empty')
      .pipe(startWith(true), takeUntil(this.destroy$))
      .subscribe(() => {
        this.content = this.specificContent || this.getUserDefaultEmptyContent();
        this.renderEmpty();
      });
  }

  private getUserDefaultEmptyContent(): Type<SnSafeAny> | TemplateRef<string> | string | undefined {
    return (this.configService.getConfigForComponent('empty') || {}).snDefaultEmptyContent;
  }
}
