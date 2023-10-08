import { NgModule } from '@angular/core';

import { SnFormControlComponent } from "./form-control.component";
import { SnFormFeedbackComponent } from "./form-feedback.component";
import { SnFormItemComponent } from "./form-item.component";
import { SnFormLabelDirective } from './form-label.directive';

@NgModule({
    declarations: [
        SnFormControlComponent,
        SnFormFeedbackComponent,
        SnFormItemComponent,
        SnFormLabelDirective,
    ],
    exports: [
        SnFormControlComponent,
        SnFormFeedbackComponent,
        SnFormItemComponent,
        SnFormLabelDirective,
    ],
    imports: [
    ]
  })
  export class SnFormModule {}
  