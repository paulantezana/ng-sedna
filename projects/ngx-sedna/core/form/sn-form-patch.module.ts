

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NzIconModule } from 'ngx-sedna/icon';

import { SnFormItemFeedbackIconComponent } from './sn-form-item-feedback-icon.component';

@NgModule({
  imports: [CommonModule, NzIconModule],
  exports: [SnFormItemFeedbackIconComponent],
  declarations: [SnFormItemFeedbackIconComponent]
})
export class SnFormPatchModule {}
