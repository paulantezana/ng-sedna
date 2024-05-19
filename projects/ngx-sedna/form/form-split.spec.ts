import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ɵComponentBed as ComponentBed, ɵcreateComponentBed as createComponentBed } from 'ngx-sedna/core/testing';

import { SnFormSplitComponent } from './form-split.component';

const testBedOptions = { imports: [NoopAnimationsModule, SnFormSplitComponent] };

describe('sn-form-split', () => {
  describe('default', () => {
    let testBed: ComponentBed<SnTestFormSplitComponent>;
    let split: DebugElement;
    beforeEach(() => {
      testBed = createComponentBed(SnTestFormSplitComponent, testBedOptions);
      split = testBed.fixture.debugElement.query(By.directive(SnFormSplitComponent));
    });
    it('should className correct', () => {
      expect(split.nativeElement.classList).toContain('ant-form-split');
    });
  });
});

@Component({
  template: ` <sn-form-split></sn-form-split> `
})
export class SnTestFormSplitComponent {}
