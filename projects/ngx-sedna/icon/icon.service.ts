

import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { HttpBackend } from '@angular/common/http';
import { Inject, Injectable, InjectionToken, OnDestroy, Optional, RendererFactory2, Self } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';

import { IconDefinition, IconService } from '@ant-design/icons-angular';

import { IconConfig, SnConfigService } from 'ngx-sedna/core/config';
import { warn } from 'ngx-sedna/core/logger';
import { SnSafeAny } from 'ngx-sedna/core/types';

import { SN_ICONS_USED_BY_ZORRO } from './icons';

export interface SnIconfontOption {
  scriptUrl: string;
}

export const SN_ICONS = new InjectionToken('sn_icons');
export const SN_ICON_DEFAULT_TWOTONE_COLOR = new InjectionToken('sn_icon_default_twotone_color');
export const DEFAULT_TWOTONE_COLOR = '#1890ff';

/**
 * It should be a global singleton, otherwise registered icons could not be found.
 */
@Injectable({
  providedIn: 'root'
})
export class SnIconService extends IconService implements OnDestroy {
  configUpdated$ = new Subject<void>();

  protected override get _disableDynamicLoading(): boolean {
    return !this.platform.isBrowser;
  }

  private iconfontCache = new Set<string>();
  private subscription: Subscription | null = null;

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  normalizeSvgElement(svg: SVGElement): void {
    if (!svg.getAttribute('viewBox')) {
      this._renderer.setAttribute(svg, 'viewBox', '0 0 1024 1024');
    }
    if (!svg.getAttribute('width') || !svg.getAttribute('height')) {
      this._renderer.setAttribute(svg, 'width', '1em');
      this._renderer.setAttribute(svg, 'height', '1em');
    }
    if (!svg.getAttribute('fill')) {
      this._renderer.setAttribute(svg, 'fill', 'currentColor');
    }
  }

  fetchFromIconfont(opt: SnIconfontOption): void {
    const { scriptUrl } = opt;
    if (this._document && !this.iconfontCache.has(scriptUrl)) {
      const script = this._renderer.createElement('script');
      this._renderer.setAttribute(script, 'src', scriptUrl);
      this._renderer.setAttribute(script, 'data-namespace', scriptUrl.replace(/^(https?|http):/g, ''));
      this._renderer.appendChild(this._document.body, script);
      this.iconfontCache.add(scriptUrl);
    }
  }

  createIconfontIcon(type: string): SVGElement {
    return this._createSVGElementFromString(`<svg><use xlink:href="${type}"></svg>`);
  }

  constructor(
    rendererFactory: RendererFactory2,
    sanitizer: DomSanitizer,
    protected snConfigService: SnConfigService,
    private platform: Platform,
    @Optional() handler: HttpBackend,
    @Optional() @Inject(DOCUMENT) _document: SnSafeAny,
    @Optional() @Inject(SN_ICONS) icons?: IconDefinition[]
  ) {
    super(rendererFactory, handler, _document, sanitizer, [...SN_ICONS_USED_BY_ZORRO, ...(icons || [])]);

    this.onConfigChange();
    this.configDefaultTwotoneColor();
    this.configDefaultTheme();
  }

  private onConfigChange(): void {
    this.subscription = this.snConfigService.getConfigChangeEventForComponent('icon').subscribe(() => {
      this.configDefaultTwotoneColor();
      this.configDefaultTheme();
      this.configUpdated$.next();
    });
  }

  private configDefaultTheme(): void {
    const iconConfig = this.getConfig();
    this.defaultTheme = iconConfig.snTheme || 'outline';
  }

  private configDefaultTwotoneColor(): void {
    const iconConfig = this.getConfig();
    const defaultTwotoneColor = iconConfig.snTwotoneColor || DEFAULT_TWOTONE_COLOR;

    let primaryColor = DEFAULT_TWOTONE_COLOR;

    if (defaultTwotoneColor) {
      if (defaultTwotoneColor.startsWith('#')) {
        primaryColor = defaultTwotoneColor;
      } else {
        warn('Twotone color must be a hex color!');
      }
    }

    this.twoToneColor = { primaryColor };
  }

  private getConfig(): IconConfig {
    return this.snConfigService.getConfigForComponent('icon') || {};
  }
}

export const SN_ICONS_PATCH = new InjectionToken('sn_icons_patch');

@Injectable()
export class SnIconPatchService {
  patched = false;

  constructor(
    @Self() @Inject(SN_ICONS_PATCH) private extraIcons: IconDefinition[],
    private rootIconService: SnIconService
  ) {}

  doPatch(): void {
    if (this.patched) {
      return;
    }

    this.extraIcons.forEach(iconDefinition => this.rootIconService.addIcon(iconDefinition));
    this.patched = true;
  }
}
