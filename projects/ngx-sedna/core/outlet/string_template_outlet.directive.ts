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
  selector: '[snStringTemplateOutlet]',
  exportAs: 'snStringTemplateOutlet',
  standalone: true
})
export class SnStringTemplateOutletDirective<_T = unknown> implements OnChanges {
  private embeddedViewRef: EmbeddedViewRef<SnSafeAny> | null = null;
  private context = new SnStringTemplateOutletContext();
  @Input() snStringTemplateOutletContext: SnSafeAny | null = null;
  @Input() snStringTemplateOutlet: SnSafeAny | TemplateRef<SnSafeAny> = null;

  static ngTemplateContextGuard<T>(
    _dir: SnStringTemplateOutletDirective<T>,
    _ctx: SnSafeAny
  ): _ctx is SnStringTemplateOutletContext {
    return true;
  }

  private recreateView(): void {
    this.viewContainer.clear();
    const isTemplateRef = this.snStringTemplateOutlet instanceof TemplateRef;
    const templateRef = (isTemplateRef ? this.snStringTemplateOutlet : this.templateRef) as SnSafeAny;
    this.embeddedViewRef = this.viewContainer.createEmbeddedView(
      templateRef,
      isTemplateRef ? this.snStringTemplateOutletContext : this.context
    );
  }

  private updateContext(): void {
    const isTemplateRef = this.snStringTemplateOutlet instanceof TemplateRef;
    const newCtx = isTemplateRef ? this.snStringTemplateOutletContext : this.context;
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
    const { snStringTemplateOutletContext, snStringTemplateOutlet } = changes;
    const shouldRecreateView = (): boolean => {
      let shouldOutletRecreate = false;
      if (snStringTemplateOutlet) {
        if (snStringTemplateOutlet.firstChange) {
          shouldOutletRecreate = true;
        } else {
          const isPreviousOutletTemplate = snStringTemplateOutlet.previousValue instanceof TemplateRef;
          const isCurrentOutletTemplate = snStringTemplateOutlet.currentValue instanceof TemplateRef;
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
        snStringTemplateOutletContext && hasContextShapeChanged(snStringTemplateOutletContext);
      return shouldContextRecreate || shouldOutletRecreate;
    };

    if (snStringTemplateOutlet) {
      this.context.$implicit = snStringTemplateOutlet.currentValue;
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

export class SnStringTemplateOutletContext {
  public $implicit: SnSafeAny;
}
