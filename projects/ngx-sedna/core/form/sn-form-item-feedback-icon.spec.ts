import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SnFormPatchModule } from 'ngx-sedna/core/form/sn-form-patch.module';
import { ɵComponentBed as ComponentBed, ɵcreateComponentBed as createComponentBed } from 'ngx-sedna/core/testing';
import { SnValidateStatus } from 'ngx-sedna/core/types';

import { SnFormItemFeedbackIconComponent } from './sn-form-item-feedback-icon.component';

const testBedOptions = { imports: [SnFormPatchModule, NoopAnimationsModule] };

describe('sn-form-item-feedback-icon', () => {
  describe('default', () => {
    let testBed: ComponentBed<SnTestFormItemFeedbackIconComponent>;
    let fixtureInstance: SnTestFormItemFeedbackIconComponent;
    let feedback: DebugElement;
    beforeEach(() => {
      testBed = createComponentBed(SnTestFormItemFeedbackIconComponent, testBedOptions);
      fixtureInstance = testBed.fixture.componentInstance;
      feedback = testBed.fixture.debugElement.query(By.directive(SnFormItemFeedbackIconComponent));
      testBed.fixture.detectChanges();
    });
    it('should className correct', () => {
      expect(feedback.nativeElement.classList).toContain('ant-form-item-feedback-icon');
      fixtureInstance.status = 'success';
      testBed.fixture.detectChanges();
      expect(feedback.nativeElement.classList).toContain('ant-form-item-feedback-icon-success');
      expect(feedback.nativeElement.querySelector('.anticon-check-circle-fill')).toBeTruthy();

      fixtureInstance.status = 'error';
      testBed.fixture.detectChanges();
      expect(feedback.nativeElement.classList).toContain('ant-form-item-feedback-icon-error');
      expect(feedback.nativeElement.querySelector('.anticon-close-circle-fill')).toBeTruthy();

      fixtureInstance.status = 'warning';
      testBed.fixture.detectChanges();
      expect(feedback.nativeElement.classList).toContain('ant-form-item-feedback-icon-warning');
      expect(feedback.nativeElement.querySelector('.anticon-exclamation-circle-fill')).toBeTruthy();

      fixtureInstance.status = 'validating';
      testBed.fixture.detectChanges();
      expect(feedback.nativeElement.classList).toContain('ant-form-item-feedback-icon-validating');
      expect(feedback.nativeElement.querySelector('.anticon-loading')).toBeTruthy();
    });
  });
});

@Component({
  template: ` <sn-form-item-feedback-icon [status]="status"></sn-form-item-feedback-icon> `
})
export class SnTestFormItemFeedbackIconComponent {
  status: SnValidateStatus = '';
}
