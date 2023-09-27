import { Component, ElementRef, HostBinding, Input, Optional, Renderer2, Self, ViewContainerRef } from '@angular/core';
// import { NgControl } from '@angular/forms';

export type SnSizeLDSType = 'large' | 'default' | 'small';
export type SnRenderTypeLDSType = 'cell' | 'default';

@Component({
  standalone: true,
  selector: 'input[sn-input],textarea[sn-input]',
  template: ``,
  styleUrls: ['./input.component.scss'],
  host: {
    'class': 'SnForm-control',
  },
})
export class SnInputComponent {

  @Input() snSize: SnSizeLDSType = 'default';
  // @Input() @InputBoolean() opBlock = false;
  @Input() snBlock: boolean = false;
  // @Input() opRenderType: SnRenderTypeLDSType = 'default';

  // @HostBinding('class')
  // get ascClass () {
  //   return  {
  //     // ['p-1'] : this.opSize === 'small',
  //     // ['p-2'] : this.opSize === 'default', 
  //     // ['p-3'] : this.opSize === 'large' ,
  //     // ['w-full'] : this.opBlock,
  //   }
  // }

  constructor(
    // @Optional() @Self() public ngControl: NgControl,
    private renderer: Renderer2,
    private elementRef: ElementRef,
    protected hostView: ViewContainerRef,
  ) { }

  ngOnInit(): void {

  }
}
