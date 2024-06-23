import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { Subject } from 'rxjs';

import { SnOutletModule } from 'ngx-sedna/core/outlet';

import { SnEmptyDefaultComponent } from './partial/default';
import { SnEmptySimpleComponent } from './partial/simple';

const SnEmptyDefaultImages = ['default', 'simple'] as const;
type SnEmptyNotFoundImageType = (typeof SnEmptyDefaultImages)[number] | null | string | TemplateRef<void>;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'sn-empty',
  exportAs: 'snEmpty',
  styleUrls: ['./scss/index.scss'],
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
          {{ isContentString ? snNotFoundContent : 'Sin datos' }}
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
export class SnEmptyComponent implements OnChanges, OnDestroy {
  @Input() snNotFoundImage: SnEmptyNotFoundImageType = 'default';
  @Input() snNotFoundContent?: string | TemplateRef<void> | null;
  @Input() snNotFoundFooter?: string | TemplateRef<void>;

  isContentString = false;
  isImageBuildIn = true;

  private readonly destroy$ = new Subject<void>();

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
