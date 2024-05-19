

import { NgModule } from '@angular/core';

import { NzGridModule } from 'ngx-sedna/grid';

import { NzFormControlComponent } from './form-control.component';
import { NzFormItemComponent } from './form-item.component';
import { NzFormLabelComponent } from './form-label.component';
import { NzFormSplitComponent } from './form-split.component';
import { NzFormTextComponent } from './form-text.component';
import { NzFormDirective } from './form.directive';

@NgModule({
  imports: [
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzFormTextComponent,
    NzFormSplitComponent
  ],
  exports: [
    NzGridModule,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzFormTextComponent,
    NzFormSplitComponent
  ]
})
export class NzFormModule {}
