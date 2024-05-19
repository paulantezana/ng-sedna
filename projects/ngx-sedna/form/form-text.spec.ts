import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ɵComponentBed as ComponentBed, ɵcreateComponentBed as createComponentBed } from 'ngx-sedna/core/testing';

import { SnFormTextComponent } from './form-text.component';

const testBedOptions = { imports: [NoopAnimationsModule, SnFormTextComponent] };

describe('sn-form-text', () => {
  describe('default', () => {
    let testBed: ComponentBed<SnTestFormTextComponent>;
    let text: DebugElement;
    beforeEach(() => {
      testBed = createComponentBed(SnTestFormTextComponent, testBedOptions);
      text = testBed.fixture.debugElement.query(By.directive(SnFormTextComponent));
    });
    it('should className correct', () => {
      expect(text.nativeElement.classList).toContain('ant-form-text');
    });
  });
});

@Component({
  template: ` <sn-form-text></sn-form-text> `
})
export class SnTestFormTextComponent {}
