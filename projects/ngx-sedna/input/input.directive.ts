import { Directive, HostBinding, Input } from '@angular/core';

export type SnInputSize = 'default' | 'small' | 'large';
export type SnRenderTypeLDSType = 'cell' | 'default';

@Directive({
  standalone: true,
  selector: 'input[sn-input],textarea[sn-input],select[sn-input]',
  exportAs: 'snButton',
  host: {
    'class': 'SnForm-control',
  },
})

export class SnInputDirective {

  @Input() snSize: SnInputSize = 'default';

  @HostBinding('class')
  get ascClass () {
    return  {
      ['sm'] : this.snSize === 'small',
      ['lg'] : this.snSize === 'large' ,
    }
  }
}
