

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SnOutletModule } from 'ngx-sedna/core/outlet';
import { SnEmptyI18nInterface, SnI18nService } from 'ngx-sedna/i18n';

import { SnEmptyDefaultComponent } from './partial/default';
import { SnEmptySimpleComponent } from './partial/simple';

const SnEmptyDefaultImages = ['default', 'simple'] as const;
type SnEmptyNotFoundImageType = (typeof SnEmptyDefaultImages)[number] | null | string | TemplateRef<void>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'sn-empty',
  exportAs: 'snEmpty',
  // styleUrls: ['./scss/index.scss'],
  template: `
    <div class="ant-empty-image">
      @if (!isImageBuildIn) {
        <ng-container *snStringTemplateOutlet="snNotFoundImage">
          <img [src]="snNotFoundImage" [alt]="isContentString ? snNotFoundContent : 'empty'" />
        </ng-container>
      } @else {
        @if (snNotFoundImage === 'simple') {
          <sn-empty-simple />
        } @else {
          <sn-empty-default />
        }
      }
    </div>
    @if (snNotFoundContent !== null) {
      <p class="ant-empty-description">
        <ng-container *snStringTemplateOutlet="snNotFoundContent">
          {{ isContentString ? snNotFoundContent : locale['description'] }}
        </ng-container>
      </p>
    }

    @if (snNotFoundFooter) {
      <div class="ant-empty-footer">
        <ng-container *snStringTemplateOutlet="snNotFoundFooter">
          {{ snNotFoundFooter }}
        </ng-container>
      </div>
    }
  `,
  host: {
    class: 'ant-empty'
  },
  imports: [SnOutletModule, SnEmptyDefaultComponent, SnEmptySimpleComponent],
  standalone: true
})
export class SnEmptyComponent implements OnChanges, OnInit, OnDestroy {
  @Input() snNotFoundImage: SnEmptyNotFoundImageType = 'default';
  @Input() snNotFoundContent?: string | TemplateRef<void> | null;
  @Input() snNotFoundFooter?: string | TemplateRef<void>;

  isContentString = false;
  isImageBuildIn = true;
  locale!: SnEmptyI18nInterface;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private i18n: SnI18nService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { snNotFoundContent, snNotFoundImage } = changes;

    if (snNotFoundContent) {
      const content = snNotFoundContent.currentValue;
      this.isContentString = typeof content === 'string';
    }

    if (snNotFoundImage) {
      const image = snNotFoundImage.currentValue || 'default';
      this.isImageBuildIn = SnEmptyDefaultImages.findIndex(i => i === image) > -1;
    }
  }

  ngOnInit(): void {
    this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.locale = this.i18n.getLocaleData('Empty');
      this.cdr.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
