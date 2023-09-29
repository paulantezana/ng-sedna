import { NgModule } from '@angular/core';

import { SnFormControlComponent } from "./form-control.component";
import { SnFormFeedbackComponent } from "./form-feedback.component";
import { SnFormItemComponent } from "./form-item.component";

@NgModule({
    declarations: [
        SnFormControlComponent,
        SnFormFeedbackComponent,
        SnFormItemComponent
    ],
    exports: [
        SnFormControlComponent,
        SnFormFeedbackComponent,
        SnFormItemComponent
    ],
    imports: [
    ]
  })
  export class SnFormModule {}
  