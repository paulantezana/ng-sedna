

import { ModuleWithProviders, NgModule } from '@angular/core';

import { IconDefinition } from '@ant-design/icons-angular';

import { SnIconDirective } from './icon.directive';
import { SN_ICONS, SN_ICONS_PATCH, SnIconPatchService } from './icon.service';

@NgModule({
  imports: [SnIconDirective],
  exports: [SnIconDirective]
})
export class SnIconModule {
  static forRoot(icons: IconDefinition[]): ModuleWithProviders<SnIconModule> {
    return {
      ngModule: SnIconModule,
      providers: [
        {
          provide: SN_ICONS,
          useValue: icons
        }
      ]
    };
  }

  static forChild(icons: IconDefinition[]): ModuleWithProviders<SnIconModule> {
    return {
      ngModule: SnIconModule,
      providers: [
        SnIconPatchService,
        {
          provide: SN_ICONS_PATCH,
          useValue: icons
        }
      ]
    };
  }
}
