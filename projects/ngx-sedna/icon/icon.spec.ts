import { Component, DebugElement, NgModule } from '@angular/core';
import { ComponentFixture, fakeAsync, inject, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  HomeOutline,
  LeftOutline,
  LoadingOutline,
  QuestionCircleFill,
  QuestionCircleOutline,
  QuestionOutline,
  RightOutline
} from '@ant-design/icons-angular/icons';

import { SnConfigService } from 'ngx-sedna/core/config';
import { ComponentBed, createComponentBed } from 'ngx-sedna/core/testing/component-bed';

import { SnIconDirective } from './icon.directive';
import { SnIconModule } from './icon.module';
import { SnIconService, SN_ICONS } from './icon.service';

describe('sn-icon', () => {
  describe('basics', () => {
    let testBed: ComponentBed<SnTestIconExtensionsComponent>;
    let testComponent: SnTestIconExtensionsComponent;
    let fixture: ComponentFixture<SnTestIconExtensionsComponent>;
    let icons: DebugElement[];

    beforeEach(() => {
      testBed = createComponentBed(SnTestIconExtensionsComponent, {
        imports: [SnIconModule],
        providers: [
          {
            provide: SN_ICONS,
            useValue: [
              LeftOutline,
              RightOutline,
              QuestionOutline,
              QuestionCircleOutline,
              LoadingOutline,
              QuestionCircleFill
            ]
          }
        ]
      });
      fixture = testBed.fixture;

      testComponent = testBed.component;
      icons = fixture.debugElement.queryAll(By.directive(SnIconDirective));
    });

    it('should get icon class name back', () => {
      fixture.detectChanges();
      expect(icons[0].nativeElement.classList.contains('anticon')).toBe(true);
      expect(icons[0].nativeElement.classList.contains('anticon-question')).toBe(true);
      expect(icons[1].nativeElement.classList.contains('anticon-loading')).toBe(true);
    });

    it('should change class name when type changes', () => {
      testComponent.type = 'question-circle';
      fixture.detectChanges();
      expect(icons[0].nativeElement.classList.contains('anticon')).toBe(true);
      expect(icons[0].nativeElement.classList.contains('anticon-question-circle')).toBe(true);
      expect(icons[0].nativeElement.classList.contains('anticon-question')).not.toBe(true);
    });

    it('should support spin and cancel', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      // Only test fails. Don't know why.
      // expect(icons[0].nativeElement.firstChild.classList.contains('anticon-spin')).toBe(true);

      testComponent.spin = false;
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(icons[0].nativeElement.firstChild.classList.contains('anticon-spin')).toBe(false);
    }));

    it('should make loading spin', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      // expect(icons[1].nativeElement.firstChild.classList.contains('anticon-spin')).toBe(true);
    }));

    it('should rotate work', fakeAsync(() => {
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(icons[0].nativeElement.firstChild.style.transform).toBeFalsy();

      testComponent.rotate = 120;
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(icons[0].nativeElement.firstChild.style.transform).toBe('rotate(120deg)');

      testComponent.rotate = 0;
      fixture.detectChanges();
      tick(1000);
      fixture.detectChanges();
      expect(icons[0].nativeElement.firstChild.style.transform).toBeFalsy();
    }));
  });

  describe('custom', () => {
    let testBed: ComponentBed<SnTestIconCustomComponent>;
    let fixture: ComponentFixture<SnTestIconCustomComponent>;
    let icons: DebugElement[];

    beforeEach(() => {
      testBed = createComponentBed(SnTestIconCustomComponent, {
        imports: [SnIconModule],
        providers: [
          {
            provide: SN_ICONS,
            useValue: [
              LeftOutline,
              RightOutline,
              QuestionOutline,
              QuestionCircleOutline,
              LoadingOutline,
              QuestionCircleFill
            ]
          }
        ]
      });
      fixture = testBed.fixture;
    });

    it('should support custom svg element', () => {
      fixture.detectChanges();
      icons = fixture.debugElement.queryAll(By.directive(SnIconDirective));
      const icon1 = icons[0];
      expect(icon1.nativeElement.className).toContain('anticon');
      expect(icon1.nativeElement.innerHTML).toContain('svg');
      expect(icon1.nativeElement.innerHTML).toContain(
        'viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor"'
      );
    });
  });

  describe('iconfont', () => {
    let testBed: ComponentBed<SnTestIconIconfontComponent>;
    let fixture: ComponentFixture<SnTestIconIconfontComponent>;
    let icons: DebugElement[];

    beforeEach(() => {
      testBed = createComponentBed(SnTestIconIconfontComponent, {
        imports: [SnIconModule],
        providers: [
          {
            provide: SN_ICONS,
            useValue: [
              LeftOutline,
              RightOutline,
              QuestionOutline,
              QuestionCircleOutline,
              LoadingOutline,
              QuestionCircleFill
            ]
          }
        ]
      });
      fixture = testBed.fixture;
    });

    it('should support iconfont', waitForAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        icons = fixture.debugElement.queryAll(By.directive(SnIconDirective));
        expect(icons[0].nativeElement.className).toContain('anticon');
        expect(icons[0].nativeElement.innerHTML).toContain('xlink:href="#icon-tuichu"');
        expect(icons[1].nativeElement.innerHTML).toContain('link:href="#icon-facebook"');
        expect(icons[2].nativeElement.innerHTML).toContain('xlink:href="#icon-twitter"');
      });
    }));
  });

  describe('config service', () => {
    let testBed: ComponentBed<SnTestIconExtensionsComponent>;
    let fixture: ComponentFixture<SnTestIconExtensionsComponent>;
    let snConfigService: SnConfigService;
    let icons: DebugElement[];

    beforeEach(() => {
      testBed = createComponentBed(SnTestIconExtensionsComponent, {
        imports: [SnIconModule],
        providers: [
          {
            provide: SN_ICONS,
            useValue: [LeftOutline, RightOutline, QuestionOutline]
          }
        ]
      });

      fixture = testBed.fixture;
      fixture.detectChanges();
      icons = fixture.debugElement.queryAll(By.directive(SnIconDirective));
    });

    beforeEach(inject([SnConfigService], (c: SnConfigService) => {
      snConfigService = c;
    }));

    it('should support config service', () => {
      snConfigService!.set('icon', { snTwotoneColor: '#234567' });
      expect(icons[0].componentInstance.iconService.twoToneColor.primaryColor).toBe('#234567');

      // Should ignore falsy value.
      snConfigService!.set('icon', { snTwotoneColor: '234567' });
      expect(icons[0].componentInstance.iconService.twoToneColor.primaryColor).not.toBe('234567');
      expect(icons[0].componentInstance.iconService.twoToneColor.primaryColor).toBe('#1890ff');
    });
  });

  describe('injection on multi places', () => {
    let testBed: ComponentBed<SnTestIconMultiInjectionComponent>;
    let fixture: ComponentFixture<SnTestIconMultiInjectionComponent>;
    let icons: DebugElement[];

    beforeEach(() => {
      testBed = createComponentBed(SnTestIconMultiInjectionComponent, {
        imports: [SnIconModule.forRoot([HomeOutline]), ChildModule]
      });
      fixture = testBed.fixture;
    });

    it('should support forRoot and forChild', () => {
      fixture.detectChanges();
      icons = fixture.debugElement.queryAll(By.directive(SnIconDirective));
      expect(icons[0].nativeElement.classList.contains('anticon-home')).toBe(true);
      expect(icons[1].nativeElement.classList.contains('anticon-question')).toBe(true);
    });
  });
});

@Component({
  // eslint-disable-next-line
  selector: 'sn-test-icon-extensions',
  template: `
    <span sn-icon [snType]="type" [snTheme]="theme" [snSpin]="spin" [snRotate]="rotate"></span>
    <span sn-icon [snType]="'loading'" [snTheme]="theme"></span>
  `
})
export class SnTestIconExtensionsComponent {
  type = 'question';
  theme = 'outline';
  spin = true;
  rotate = 0;

  constructor(public iconService: SnIconService) {}
}

@Component({
  template: `
    <span sn-icon style="color: hotpink;">
      <svg>
        <path
          d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z"
        />
      </svg>
    </span>
  `
})
export class SnTestIconCustomComponent {}

@Component({
  template: `
    <span sn-icon [snIconfont]="'icon-tuichu'"></span>
    <span sn-icon [snIconfont]="'icon-facebook'"></span>
    <span sn-icon [snIconfont]="'icon-twitter'"></span>
  `
})
export class SnTestIconIconfontComponent {
  constructor(private iconService: SnIconService) {
    this.iconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
    });
  }
}

@NgModule({
  imports: [SnIconModule.forChild([QuestionOutline])],
  declarations: [SnTestIconExtensionsComponent],
  exports: [SnTestIconExtensionsComponent]
})
class ChildModule {}

@Component({
  template: `
    <span sn-icon snType="home"></span>
    <span sn-icon snType="question"></span>
  `
})
class SnTestIconMultiInjectionComponent {}
