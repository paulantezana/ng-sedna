

import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { SnSafeAny } from 'ngx-sedna/core/types';

@Directive({
  selector: '[nzStringTemplateOutlet]',
  exportAs: 'nzStringTemplateOutlet',
  standalone: true
})
export class SnStringTemplateOutletDirective<_T = unknown> implements OnChanges {
  private embeddedViewRef: EmbeddedViewRef<SnSafeAny> | null = null;
  private context = new NzStringTemplateOutletContext();
  @Input() nzStringTemplateOutletContext: SnSafeAny | null = null;
  @Input() nzStringTemplateOutlet: SnSafeAny | TemplateRef<SnSafeAny> = null;

  static ngTemplateContextGuard<T>(
    _dir: SnStringTemplateOutletDirective<T>,
    _ctx: SnSafeAny
  ): _ctx is NzStringTemplateOutletContext {
    return true;
  }

  private recreateView(): void {
    this.viewContainer.clear();
    const isTemplateRef = this.nzStringTemplateOutlet instanceof TemplateRef;
    const templateRef = (isTemplateRef ? this.nzStringTemplateOutlet : this.templateRef) as SnSafeAny;
    this.embeddedViewRef = this.viewContainer.createEmbeddedView(
      templateRef,
      isTemplateRef ? this.nzStringTemplateOutletContext : this.context
    );
  }

  private updateContext(): void {
    const isTemplateRef = this.nzStringTemplateOutlet instanceof TemplateRef;
    const newCtx = isTemplateRef ? this.nzStringTemplateOutletContext : this.context;
    const oldCtx = this.embeddedViewRef!.context as SnSafeAny;
    if (newCtx) {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
  }

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<SnSafeAny>
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { nzStringTemplateOutletContext, nzStringTemplateOutlet } = changes;
    const shouldRecreateView = (): boolean => {
      let shouldOutletRecreate = false;
      if (nzStringTemplateOutlet) {
        if (nzStringTemplateOutlet.firstChange) {
          shouldOutletRecreate = true;
        } else {
          const isPreviousOutletTemplate = nzStringTemplateOutlet.previousValue instanceof TemplateRef;
          const isCurrentOutletTemplate = nzStringTemplateOutlet.currentValue instanceof TemplateRef;
          shouldOutletRecreate = isPreviousOutletTemplate || isCurrentOutletTemplate;
        }
      }
      const hasContextShapeChanged = (ctxChange: SimpleChange): boolean => {
        const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        const currCtxKeys = Object.keys(ctxChange.currentValue || {});
        if (prevCtxKeys.length === currCtxKeys.length) {
          for (const propName of currCtxKeys) {
            if (prevCtxKeys.indexOf(propName) === -1) {
              return true;
            }
          }
          return false;
        } else {
          return true;
        }
      };
      const shouldContextRecreate =
        nzStringTemplateOutletContext && hasContextShapeChanged(nzStringTemplateOutletContext);
      return shouldContextRecreate || shouldOutletRecreate;
    };

    if (nzStringTemplateOutlet) {
      this.context.$implicit = nzStringTemplateOutlet.currentValue;
    }

    const recreateView = shouldRecreateView();
    if (recreateView) {
      /** recreate view when context shape or outlet change **/
      this.recreateView();
    } else {
      /** update context **/
      this.updateContext();
    }
  }
}

export class NzStringTemplateOutletContext {
  public $implicit: SnSafeAny;
}
