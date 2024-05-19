

import { Pipe, PipeTransform } from '@angular/core';

import { SnI18nService } from './sn-i18n.service';

@Pipe({
  name: 'snI18n',
  standalone: true
})
export class SnI18nPipe implements PipeTransform {
  constructor(private _locale: SnI18nService) {}

  transform(path: string, keyValue?: object): string {
    return this._locale.translate(path, keyValue);
  }
}
