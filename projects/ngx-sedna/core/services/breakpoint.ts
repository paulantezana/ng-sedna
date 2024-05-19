

import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

import { SnResizeService } from './resize';

export enum SnBreakpointEnum {
  xxl = 'xxl',
  xl = 'xl',
  lg = 'lg',
  md = 'md',
  sm = 'sm',
  xs = 'xs'
}

export type BreakpointMap = { [key in SnBreakpointEnum]: string };
export type BreakpointBooleanMap = { [key in SnBreakpointEnum]: boolean };
export type NzBreakpointKey = keyof typeof SnBreakpointEnum;

export const gridResponsiveMap: BreakpointMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
};

export const siderResponsiveMap: BreakpointMap = {
  xs: '(max-width: 479.98px)',
  sm: '(max-width: 575.98px)',
  md: '(max-width: 767.98px)',
  lg: '(max-width: 991.98px)',
  xl: '(max-width: 1199.98px)',
  xxl: '(max-width: 1599.98px)'
};

@Injectable({
  providedIn: 'root'
})
export class SnBreakpointService implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private resizeService: SnResizeService,
    private mediaMatcher: MediaMatcher
  ) {
    this.resizeService
      .subscribe()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  subscribe(breakpointMap: BreakpointMap): Observable<SnBreakpointEnum>;
  subscribe(breakpointMap: BreakpointMap, fullMap: true): Observable<BreakpointBooleanMap>;
  subscribe(breakpointMap: BreakpointMap, fullMap?: true): Observable<SnBreakpointEnum | BreakpointBooleanMap> {
    if (fullMap) {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const get = () => this.matchMedia(breakpointMap, true);
      return this.resizeService.subscribe().pipe(
        map(get),
        startWith(get()),
        distinctUntilChanged(
          (x: [SnBreakpointEnum, BreakpointBooleanMap], y: [SnBreakpointEnum, BreakpointBooleanMap]) => x[0] === y[0]
        ),
        map(x => x[1])
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      const get = () => this.matchMedia(breakpointMap);
      return this.resizeService.subscribe().pipe(map(get), startWith(get()), distinctUntilChanged());
    }
  }

  private matchMedia(breakpointMap: BreakpointMap): SnBreakpointEnum;
  private matchMedia(breakpointMap: BreakpointMap, fullMap: true): [SnBreakpointEnum, BreakpointBooleanMap];
  private matchMedia(
    breakpointMap: BreakpointMap,
    fullMap?: true
  ): SnBreakpointEnum | [SnBreakpointEnum, BreakpointBooleanMap] {
    let bp = SnBreakpointEnum.md;

    const breakpointBooleanMap: Partial<BreakpointBooleanMap> = {};

    Object.keys(breakpointMap).map(breakpoint => {
      const castBP = breakpoint as SnBreakpointEnum;
      const matched = this.mediaMatcher.matchMedia(gridResponsiveMap[castBP]).matches;

      breakpointBooleanMap[breakpoint as SnBreakpointEnum] = matched;

      if (matched) {
        bp = castBP;
      }
    });

    if (fullMap) {
      return [bp, breakpointBooleanMap as BreakpointBooleanMap];
    } else {
      return bp;
    }
  }
}
