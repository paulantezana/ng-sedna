import { Component, Inject, OnDestroy } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';

import { SN_I18N, provideSnI18n } from 'ngx-sedna/i18n/sn-i18n.token';

import cs_CZ from './languages/cs_CZ';
import de_DE from './languages/de_DE';
import en_US from './languages/en_US';
import ka_GE from './languages/ka_GE';
import zh_CN from './languages/zh_CN';
import { SnI18nInterface } from './sn-i18n.interface';
import { SnI18nModule } from './sn-i18n.module';
import { SnI18nService } from './sn-i18n.service';

describe('i18n service', () => {
  let srv: SnI18nService;
  let fixture: ComponentFixture<SnI18nTestComponent>;
  let testComponent: SnI18nTestComponent;
  const DEFAULT_LAN = zh_CN;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SnI18nTestComponent],
      imports: [SnI18nModule],
      providers: [provideSnI18n(DEFAULT_LAN)]
    }).compileComponents();
  });

  describe('#setLocale', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SnI18nTestComponent);
      testComponent = fixture.debugElement.componentInstance;
    });

    beforeEach(inject([SnI18nService], (s: SnI18nService) => {
      srv = s;
    }));

    it('should interface be right', () => {
      const i18nEN: SnI18nInterface = en_US;
      const i18nDE: SnI18nInterface = de_DE;
      const i18nCS: SnI18nInterface = cs_CZ;
      const i18nKA: SnI18nInterface = ka_GE;
      console.log(i18nEN, i18nDE, i18nCS, i18nKA);
    });

    it('should be provide interface be right', () => {
      fixture = TestBed.createComponent(SnI18nTestComponent);
      expect(fixture.componentInstance.locale === DEFAULT_LAN).toBe(true);
    });

    it('should be auto default zh_CN', () => {
      expect(testComponent.locale.locale).toBe(DEFAULT_LAN.locale);
    });

    it('should trigger changed when set different lang', () => {
      const spy = spyOn(testComponent, 'updateLocale');
      expect(spy).not.toHaveBeenCalled();
      srv.setLocale(en_US);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not trigger change when set same lang', () => {
      const spy = spyOn(testComponent, 'updateLocale');
      expect(spy).not.toHaveBeenCalled();
      srv.setLocale(zh_CN);
      expect(spy).not.toHaveBeenCalled();
    });

    it('should warn when locale for a component is not provided', () => {
      const spy = spyOn(console, 'warn');
      srv.setLocale({ locale: 'not_existing_language' } as any); // eslint-disable-line  @typescript-eslint/no-explicit-any
      expect(srv.getLocaleData('global.placeholder')).toBeTruthy();
      expect(spy).toHaveBeenCalledWith(
        '[NG-ZORRO]:',
        `Missing translations for "global.placeholder" in language "not_existing_language".
You can use "SnI18nService.setLocale" as a temporary fix.
Welcome to submit a pull request to help us optimize the translations!
https://github.com/NG-ZORRO/ngx-sedna/blob/master/CONTRIBUTING.md`
      );
    });
  });
});

@Component({
  template: ''
})
export class SnI18nTestComponent implements OnDestroy {
  private localeSubscription: Subscription;

  constructor(
    private snI18nService: SnI18nService,
    @Inject(SN_I18N) public locale: SnI18nInterface
  ) {
    this.localeSubscription = this.snI18nService.localeChange.subscribe(locale => {
      this.updateLocale(locale);
    });
  }

  ngOnDestroy(): void {
    this.localeSubscription.unsubscribe();
  }

  updateLocale(locale: SnI18nInterface): void {
    this.locale = locale;
  }
}
