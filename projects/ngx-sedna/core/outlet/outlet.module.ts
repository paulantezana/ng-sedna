

import { NgModule } from '@angular/core';

import { SnStringTemplateOutletDirective } from './string_template_outlet.directive';

@NgModule({
  imports: [SnStringTemplateOutletDirective],
  exports: [SnStringTemplateOutletDirective]
})
export class SnOutletModule {}
