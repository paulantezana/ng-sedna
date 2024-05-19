

import { NgModule } from '@angular/core';

import { SnGridModule } from 'ngx-sedna/grid';

import { SnFormControlComponent } from './form-control.component';
import { SnFormItemComponent } from './form-item.component';
import { SnFormLabelComponent } from './form-label.component';
import { SnFormSplitComponent } from './form-split.component';
import { SnFormTextComponent } from './form-text.component';
import { SnFormDirective } from './form.directive';

@NgModule({
  imports: [
    SnFormDirective,
    SnFormItemComponent,
    SnFormLabelComponent,
    SnFormControlComponent,
    SnFormTextComponent,
    SnFormSplitComponent
  ],
  exports: [
    SnGridModule,
    SnFormDirective,
    SnFormItemComponent,
    SnFormLabelComponent,
    SnFormControlComponent,
    SnFormTextComponent,
    SnFormSplitComponent
  ]
})
export class SnFormModule {}
