import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SnButtonComponent, SnButtonModule } from 'ngx-sedna/button';

import { provideSnConfig } from './config';
import { SnConfigService } from './config.service';

@Component({
  template: ` <button sn-button snType="primary" [snSize]="size">Global Config</button> `
})
export class SnGlobalConfigTestBasicComponent {
  size?: 'large' | 'default' | 'small';

  constructor(public snConfigService: SnConfigService) {}
}

describe('sn global config', () => {
  let fixture: ComponentFixture<SnGlobalConfigTestBasicComponent>;
  let testComponent: SnGlobalConfigTestBasicComponent;
  let button: DebugElement;
  let buttonEl: HTMLButtonElement;

  describe('without config', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SnButtonModule],
        declarations: [SnGlobalConfigTestBasicComponent]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SnGlobalConfigTestBasicComponent);
      testComponent = fixture.debugElement.componentInstance;
      button = fixture.debugElement.query(By.directive(SnButtonComponent));
      buttonEl = button.nativeElement;
    });

    it('should render with in-component props', () => {
      fixture.detectChanges();
      expect(buttonEl.className).toContain('ant-btn ant-btn-primary');

      testComponent.size = 'large';
      fixture.detectChanges();
      expect(buttonEl.classList).toContain('ant-btn-lg');
    });
  });

  describe('with config', () => {
    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SnButtonModule],
        declarations: [SnGlobalConfigTestBasicComponent],
        providers: [
          provideSnConfig({
            button: {
              snSize: 'large'
            }
          })
        ]
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(SnGlobalConfigTestBasicComponent);
      testComponent = fixture.debugElement.componentInstance;
      button = fixture.debugElement.query(By.directive(SnButtonComponent));
      buttonEl = button.nativeElement;
    });

    it('should static config work', () => {
      fixture.detectChanges();
      expect(buttonEl.classList).toContain('ant-btn-lg');

      testComponent.size = 'default';
      fixture.detectChanges();
      expect(buttonEl.classList).not.toContain('ant-btn-lg');
    });

    it('should dynamic config work', () => {
      fixture.detectChanges();
      expect(buttonEl.classList).toContain('ant-btn-lg');

      testComponent.snConfigService.set('button', { snSize: 'small' });
      fixture.detectChanges();
      expect(buttonEl.classList).toContain('ant-btn-sm');

      testComponent.size = 'default';
      fixture.detectChanges();
      expect(buttonEl.classList).not.toContain('ant-btn-lg');
      expect(buttonEl.classList).not.toContain('ant-btn-sm');
    });

    it('should dynamic theme colors config work', () => {
      fixture.detectChanges();
      testComponent.snConfigService.set('theme', { primaryColor: '#0000FF' });
      fixture.detectChanges();
      expect(getComputedStyle(document.documentElement).getPropertyValue('--ant-primary-color').trim()).toEqual(
        'rgb(0, 0, 255)'
      );
    });

    it('should dynamic theme colors config with custom prefix work', () => {
      fixture.detectChanges();
      testComponent.snConfigService.set('prefixCls', { prefixCls: 'custom-variable' });
      testComponent.snConfigService.set('theme', { primaryColor: '#0000FF' });
      fixture.detectChanges();
      expect(
        getComputedStyle(document.documentElement).getPropertyValue('--custom-variable-primary-color').trim()
      ).toEqual('rgb(0, 0, 255)');
    });

    // It would fail silently. User cannot input a component name wrong - TypeScript comes to help!
    // it('should raise error when the component with given name is not defined', () => {
    //   expect(() => {
    // eslint-disable-line  @typescript-eslint/no-explicit-any
    //   }).toThrowError();
    // });
  });
});
