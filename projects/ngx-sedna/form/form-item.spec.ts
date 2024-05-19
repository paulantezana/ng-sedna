import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ɵComponentBed as ComponentBed, ɵcreateComponentBed as createComponentBed } from 'ngx-sedna/core/testing';

import { SnFormItemComponent } from './form-item.component';
import { SnFormModule } from './form.module';

const testBedOptions = { imports: [SnFormModule, NoopAnimationsModule] };

describe('sn-form-item', () => {
  describe('default', () => {
    let testBed: ComponentBed<SnTestFormItemComponent>;
    let formItem: DebugElement;
    beforeEach(() => {
      testBed = createComponentBed(SnTestFormItemComponent, testBedOptions);
      formItem = testBed.fixture.debugElement.query(By.directive(SnFormItemComponent));
    });
    it('should className correct', () => {
      expect(formItem.nativeElement.classList).toContain('ant-form-item');
    });
  });
});

@Component({
  template: ` <sn-form-item></sn-form-item> `
})
export class SnTestFormItemComponent {}
