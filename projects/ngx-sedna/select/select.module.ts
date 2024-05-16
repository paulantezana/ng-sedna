import { NgModule } from '@angular/core';

import { SnOptionContainerComponent } from './option-container.component';
import { SnOptionGroupComponent } from './option-group.component';
import { SnOptionItemGroupComponent } from './option-item-group.component';
import { SnOptionItemComponent } from './option-item.component';
import { SnOptionComponent } from './option.component';
import { SnSelectArrowComponent } from './select-arrow.component';
import { SnSelectClearComponent } from './select-clear.component';
import { SnSelectItemComponent } from './select-item.component';
import { SnSelectPlaceholderComponent } from './select-placeholder.component';
import { SnSelectSearchComponent } from './select-search.component';
import { SnSelectTopControlComponent } from './select-top-control.component';
import { SnSelectComponent } from './select.component';

@NgModule({
  imports: [
    SnOptionComponent,
    SnSelectComponent,
    SnOptionContainerComponent,
    SnOptionGroupComponent,
    SnOptionItemComponent,
    SnSelectTopControlComponent,
    SnSelectSearchComponent,
    SnSelectItemComponent,
    SnSelectClearComponent,
    SnSelectArrowComponent,
    SnSelectPlaceholderComponent,
    SnOptionItemGroupComponent
  ],
  exports: [
    SnOptionComponent,
    SnSelectComponent,
    SnOptionGroupComponent,
    SnSelectArrowComponent,
    SnSelectClearComponent,
    SnSelectItemComponent,
    SnSelectPlaceholderComponent,
    SnSelectSearchComponent
  ]
})
export class SnSelectModule {}
