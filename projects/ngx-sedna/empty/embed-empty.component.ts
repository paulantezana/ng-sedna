

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

import { NZ_EMPTY_COMPONENT_NAME, NzEmptyCustomContent, NzEmptySize } from './config';
import { NzEmptyComponent } from './empty.component';

function getEmptySize(componentName: string): NzEmptySize {
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

type NzEmptyContentType = 'component' | 'template' | 'string';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'nz-embed-empty',
  exportAs: 'nzEmbedEmpty',
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
            <nz-empty class="ant-empty-normal" nzNotFoundImage="simple" />
          }
          @case ('small') {
            <nz-empty class="ant-empty-small" nzNotFoundImage="simple" />
          }
          @default {
            <nz-empty />
          }
        }
      }
    }
  `,
  imports: [NzEmptyComponent, PortalModule],
  standalone: true
})
export class NzEmbedEmptyComponent implements OnChanges, OnInit, OnDestroy {
  @Input() nzComponentName?: string;
  @Input() specificContent?: NzEmptyCustomContent;

  content?: NzEmptyCustomContent;
  contentType: NzEmptyContentType = 'string';
  contentPortal?: Portal<SnSafeAny>;
  size: NzEmptySize = '';

  private destroy$ = new Subject<void>();

  constructor(
    private configService: SnConfigService,
    private viewContainerRef: ViewContainerRef,
    private cdr: ChangeDetectorRef,
    private injector: Injector
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { nzComponentName, specificContent } = changes;
    if (nzComponentName) {
      this.size = getEmptySize(nzComponentName.currentValue);
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
      const context = { $implicit: this.nzComponentName } as SnSafeAny;
      this.contentType = 'template';
      this.contentPortal = new TemplatePortal(content, this.viewContainerRef, context);
    } else if (content instanceof Type) {
      const injector = Injector.create({
        parent: this.injector,
        providers: [{ provide: NZ_EMPTY_COMPONENT_NAME, useValue: this.nzComponentName }]
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
    return (this.configService.getConfigForComponent('empty') || {}).nzDefaultEmptyContent;
  }
}
