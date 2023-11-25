import { NgModule } from '@angular/core';

import { SnFormControlComponent } from "./form-control.component";
import { SnFormFeedbackDirective } from "./form-feedback.directive";
import { SnFormItemComponent } from "./form-item.component";
import { SnFormLabelDirective } from './form-label.directive';

@NgModule({
    declarations: [
        SnFormControlComponent,
        SnFormFeedbackDirective,
        SnFormItemComponent,
        SnFormLabelDirective,
    ],
    exports: [
        SnFormControlComponent,
        SnFormFeedbackDirective,
        SnFormItemComponent,
        SnFormLabelDirective,
    ],
    imports: [
    ]
  })
  export class SnFormModule {}
  