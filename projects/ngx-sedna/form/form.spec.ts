import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ɵComponentBed as ComponentBed, ɵcreateComponentBed as createComponentBed } from 'ngx-sedna/core/testing';

import { SnFormItemComponent } from './form-item.component';
import { SnFormLabelComponent } from './form-label.component';
import { SnFormDirective } from './form.directive';

const testBedOptions = {
  imports: [NoopAnimationsModule, SnFormLabelComponent, SnFormDirective, SnFormItemComponent]
};

describe('sn-form', () => {
  describe('default', () => {
    let testBed: ComponentBed<SnTestFormDirectiveComponent>;
    let testComponent: SnTestFormDirectiveComponent;
    let form: DebugElement;
    beforeEach(() => {
      testBed = createComponentBed(SnTestFormDirectiveComponent, testBedOptions);
      testComponent = testBed.component;
      form = testBed.fixture.debugElement.query(By.directive(SnFormDirective));
    });
    it('should className correct', () => {
      expect(form.nativeElement.classList).toContain('ant-form');
      expect(form.nativeElement.classList).toContain('ant-form-horizontal');
    });
    it('should layout work', () => {
      testComponent.layout = 'vertical';

      testBed.fixture.detectChanges();

      expect(form.nativeElement.classList).toContain('ant-form-vertical');
      expect(form.nativeElement.classList).not.toContain('ant-form-horizontal');

      testComponent.layout = 'inline';

      testBed.fixture.detectChanges();

      expect(form.nativeElement.classList).not.toContain('ant-form-vertical');
      expect(form.nativeElement.classList).not.toContain('ant-form-horizontal');
      expect(form.nativeElement.classList).toContain('ant-form-inline');
    });
  });

  describe('label integrate', () => {
    let testBed: ComponentBed<SnTestFormLabelIntegrateComponent>;
    let testComponent: SnTestFormLabelIntegrateComponent;
    let form: DebugElement;
    beforeEach(() => {
      testBed = createComponentBed(SnTestFormLabelIntegrateComponent, testBedOptions);
      testComponent = testBed.component;
      form = testBed.fixture.debugElement.query(By.directive(SnFormDirective));
    });

    afterEach(() => {
      testComponent.defaultNoColon = false;
      testComponent.noColon = false;
      testComponent.testPriority = false;
    });

    it('should set default `NoColon` value', () => {
      const labels = (form.nativeElement as HTMLElement).querySelectorAll<HTMLLabelElement>(
        '.ant-form-item-label label'
      );
      labels.forEach(label => expect(label.classList).not.toContain('ant-form-item-no-colon'));

      testComponent.defaultNoColon = true;

      testBed.fixture.detectChanges();

      labels.forEach(label => expect(label.classList).toContain('ant-form-item-no-colon'));
    });

    it('should label have high priority', () => {
      const labels = (form.nativeElement as HTMLElement).querySelectorAll<HTMLLabelElement>(
        '.ant-form-item-label label'
      );
      labels.forEach(label => expect(label.classList).not.toContain('ant-form-item-no-colon'));

      testComponent.defaultNoColon = true;

      testBed.fixture.detectChanges();

      labels.forEach(label => expect(label.classList).toContain('ant-form-item-no-colon'));
      testComponent.testPriority = true;

      testBed.fixture.detectChanges();

      labels.forEach(label => expect(label.classList).toContain('ant-form-item-no-colon'));
      labels.forEach(label => {
        if (label.innerText === 'TEST_PRIORITY') {
          expect(label.classList).not.toContain('ant-form-item-no-colon');
        } else {
          expect(label.classList).toContain('ant-form-item-no-colon');
        }
      });

      testComponent.defaultNoColon = false;
      testComponent.noColon = true;

      testBed.fixture.detectChanges();

      labels.forEach(label => {
        if (label.innerText === 'TEST_PRIORITY') {
          expect(label.classList).toContain('ant-form-item-no-colon');
        } else {
          expect(label.classList).not.toContain('ant-form-item-no-colon');
        }
      });
    });
  });
});

@Component({
  template: ` <form sn-form [snLayout]="layout"></form> `
})
export class SnTestFormDirectiveComponent {
  layout = 'horizontal';
}

@Component({
  template: `
    <form sn-form [snNoColon]="defaultNoColon">
      <sn-form-item>
        <sn-form-label>Label</sn-form-label>
      </sn-form-item>
      <sn-form-item>
        <sn-form-label>Label</sn-form-label>
      </sn-form-item>
      @if (testPriority) {
        <sn-form-item>
          <sn-form-label [snNoColon]="noColon">TEST_PRIORITY</sn-form-label>
        </sn-form-item>
      }
    </form>
  `
})
export class SnTestFormLabelIntegrateComponent {
  defaultNoColon = false;
  testPriority = false;
  noColon = false;
}
