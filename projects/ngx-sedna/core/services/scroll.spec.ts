/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-inferrable-types, @typescript-eslint/no-explicit-any, prefer-const */
import { DOCUMENT, PlatformLocation } from '@angular/common';
import { ApplicationRef, Injector, NgZone } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SnScrollService } from './scroll';

describe('SnScrollService', () => {
  const TOP: number = 10;
  let injector: Injector;
  let document: MockDocument;
  let scrollService: SnScrollService;

  class MockDocument {
    body = new MockElement();
    documentElement = new MockDocumentElement();
  }

  class MockDocumentElement {
    scrollTop = jasmine.createSpy('scrollTop');
  }

  class MockElement {
    scrollTop = jasmine.createSpy('scrollTop');
  }

  class MockPlatformLocation {
    hash!: string;
  }

  beforeEach(() => {
    spyOn(window, 'scrollBy');
  });

  beforeEach(() => {
    injector = TestBed.configureTestingModule({
      providers: [
        SnScrollService,
        { provide: DOCUMENT, useClass: MockDocument },
        { provide: PlatformLocation, useClass: MockPlatformLocation }
      ]
    });

    document = injector.get<MockDocument>(DOCUMENT);
    scrollService = injector.get(SnScrollService);
  });

  describe('#setScrollTop', () => {
    it(`should scroll to window ${TOP} x`, () => {
      scrollService.setScrollTop(window, TOP);
      expect(document.body.scrollTop).toBe(TOP);
      scrollService.setScrollTop(window, 0);
    });

    it(`should scroll to dom element ${TOP} x`, () => {
      let el: Element = new MockElement() as any;
      scrollService.setScrollTop(el, TOP);
      expect(el.scrollTop).toBe(TOP);
      scrollService.setScrollTop(el, 0);
    });
  });

  describe('#getOffset', () => {
    it(`should be working`, () => {
      const ret = scrollService.getOffset({
        ownerDocument: {
          documentElement: {
            clientTop: 1,
            clientLeft: 1
          }
        },
        getClientRects: () => [0],
        getBoundingClientRect: () => ({ top: 10, left: 10, width: 100, height: 100 })
      } as any);
      expect(ret.left).toBe(9);
      expect(ret.top).toBe(9);
    });

    it(`should be return 0 when is no getClientRects`, () => {
      const ret = scrollService.getOffset({ getClientRects: () => [] } as any);
      expect(ret.left).toBe(0);
      expect(ret.top).toBe(0);
    });

    it(`should be return element top when element is not size`, () => {
      const ret = scrollService.getOffset({
        getClientRects: () => [0],
        getBoundingClientRect: () => ({ top: 1, left: 1 })
      } as any);
      expect(ret.left).toBe(1);
      expect(ret.top).toBe(1);
    });
  });

  describe('#getScroll', () => {
    it('should be return scrollTop when target is window', () => {
      const mockWin: any = { pageYOffset: 10 };
      mockWin.window = mockWin;
      expect(scrollService.getScroll(mockWin)).toBe(10);
    });
    it('should be return scrollTop when target is html element', () => {
      const mockEl: any = { scrollTop: 10 };
      expect(scrollService.getScroll(mockEl)).toBe(10);
    });
  });

  describe('change detection behavior', () => {
    // The `requestAnimationFrame` is mocked as `setTimeout(fn, 16)`.
    const tickAnimationFrame = (): void => tick(16);

    it('should not trigger change detection when calling `scrollTo`', fakeAsync(() => {
      const appRef = TestBed.inject(ApplicationRef);
      spyOn(appRef, 'tick');

      scrollService.scrollTo();

      tickAnimationFrame();

      expect(appRef.tick).not.toHaveBeenCalled();
    }));

    it('should call the custom callback within the Angular zone', fakeAsync(() => {
      let callbackHasBeenCalledWithinTheAngularZone = false;

      scrollService.scrollTo(undefined, undefined, {
        duration: 0,
        callback: () => {
          callbackHasBeenCalledWithinTheAngularZone = NgZone.isInAngularZone();
        }
      });

      tickAnimationFrame();

      expect(callbackHasBeenCalledWithinTheAngularZone).toBeTrue();
    }));
  });
});
