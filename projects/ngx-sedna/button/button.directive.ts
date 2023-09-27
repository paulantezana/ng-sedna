import { Directive, Input, HostBinding } from '@angular/core';

export type SnButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'white';
export type SnButtonSize = 'default' | 'small' | 'large';
export type SnButtonShape = 'default' | 'radio';

@Directive({
  standalone: true,
  selector: 'button[sn-button], a[sn-button]',
  exportAs: 'snButton',
  host: {
    'class': 'SnBtn',
  },
})
export class SnButtonDirective {
  @Input() snLoading: boolean = false;
  @Input() snBlock: boolean = false;
  @Input() snIcon: boolean = false;
  @Input() snType: SnButtonType = 'default';
  @Input() snSize: SnButtonSize = 'default';
  @Input() snShape: SnButtonShape = 'default';

  @HostBinding('class')
  get ascClass () {
    return  {
      ['loading'] : this.snLoading,
      ['block'] : this.snBlock,
      ['icon'] : this.snIcon,
      ['sm'] : this.snSize === 'small',
      ['lg'] : this.snSize === 'large' ,
      ['primary'] : this.snType === 'primary' ,
      ['success'] : this.snType === 'success' ,
      ['warning'] : this.snType === 'warning' ,
      ['danger'] : this.snType === 'danger' ,
      ['white'] : this.snType === 'white' ,
      ['radio'] : this.snShape === 'radio' ,
    }
  }
}
