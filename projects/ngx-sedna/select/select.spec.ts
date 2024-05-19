import { BACKSPACE, DOWN_ARROW, ENTER, ESCAPE, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ApplicationRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import {
  dispatchFakeEvent,
  dispatchKeyboardEvent,
  dispatchMouseEvent,
  ɵComponentBed as ComponentBed,
  ɵcreateComponentBed as createComponentBed
} from 'ngx-sedna/core/testing';
import { SnSafeAny, SnStatus } from 'ngx-sedna/core/types';
import { SnFormControlStatusType, SnFormModule } from 'ngx-sedna/form';
import { SnIconTestModule } from 'ngx-sedna/icon/testing';

import { SnSelectSearchComponent } from './select-search.component';
import { SnSelectTopControlComponent } from './select-top-control.component';
import { SnSelectComponent, SnSelectSizeType } from './select.component';
import { SnSelectModule } from './select.module';
import {
  SnFilterOptionType,
  SnSelectItemInterface,
  SnSelectOptionInterface,
  SnSelectPlacementType
} from './select.types';

describe('select', () => {
  describe('default template mode', () => {
    let testBed: ComponentBed<TestSelectTemplateDefaultComponent>;
    let component: TestSelectTemplateDefaultComponent;
    let fixture: ComponentFixture<TestSelectTemplateDefaultComponent>;
    let selectElement!: HTMLElement;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
      testBed = createComponentBed(TestSelectTemplateDefaultComponent, {
        imports: [SnSelectModule, SnIconTestModule, FormsModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
      selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
    });

    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    }));

    it('should classname correct', () => {
      expect(selectElement.classList).toContain('ant-select');
      expect(selectElement.classList).toContain('ant-select-single');
    });
    it('should snSize work', () => {
      component.snSize = 'large';
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-lg');
      component.snSize = 'small';
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-sm');
    });
    it('should snPlaceHolder work', () => {
      expect(selectElement.querySelector('.ant-select-selection-placeholder')!.textContent!.trim()).toBe('');
      component.snPlaceHolder = 'placeholder';
      fixture.detectChanges();
      expect(selectElement.querySelector('.ant-select-selection-placeholder')!.textContent).toContain('placeholder');
    });
    it('should snDropdownRender work', () => {
      component.snOpen = true;
      fixture.detectChanges();
      expect(document.getElementsByClassName('dropdown-render').length).toBe(0);
      component.snDropdownRender = component.dropdownTemplate;
      fixture.detectChanges();
      expect(document.getElementsByClassName('dropdown-render')[0]!.textContent).toBe('dropdownRender');
    });
    it('should ngModel match snLabel', fakeAsync(() => {
      component.listOfOption = [{ snValue: 'test_value', snLabel: 'test_label' }];
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')).toBeFalsy();
      component.value = 'test_value';
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')!.textContent).toBe('test_label');
      component.listOfOption = [];
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')!.textContent).toBe('test_label');
      expect(component.valueChange).not.toHaveBeenCalled();
    }));
    it('should ngModelChange trigger when click option', fakeAsync(() => {
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'test_01' },
        { snValue: 'test_02', snLabel: 'test_02' }
      ];
      component.value = 'test_01';
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.valueChange).toHaveBeenCalledWith('test_02');
      expect(component.openChange).toHaveBeenCalledTimes(1);
      expect(component.openChange).toHaveBeenCalledWith(false);
    }));
    it('should ngModelChange trigger when click clear icon', fakeAsync(() => {
      component.listOfOption = [{ snValue: 'test_value', snLabel: 'test_label' }];
      component.value = 'test_value';
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-clear')).toBeFalsy();
      component.snAllowClear = true;
      fixture.detectChanges();
      dispatchMouseEvent(selectElement.querySelector('sn-select-clear')!, 'click');
      fixture.detectChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.valueChange).toHaveBeenCalledWith(null);
    }));
    it('should snOpenChange trigger correct times', () => {
      component.snOpen = true;
      fixture.detectChanges();
      expect(component.openChange).not.toHaveBeenCalled();
      const topSelectElement = selectElement.querySelector('.ant-select-selector')!;
      dispatchFakeEvent(topSelectElement, 'click');
      fixture.detectChanges();
      expect(component.openChange).toHaveBeenCalledTimes(1);
      expect(component.openChange).toHaveBeenCalledWith(false);
      dispatchFakeEvent(topSelectElement, 'click');
      fixture.detectChanges();
      expect(component.openChange).toHaveBeenCalledTimes(2);
      expect(component.openChange).toHaveBeenCalledWith(true);
    });
    it('should click input not close in searching mode', () => {
      component.snShowSearch = true;
      fixture.detectChanges();
      const topSelectElement = selectElement.querySelector('.ant-select-selector')!;
      dispatchFakeEvent(topSelectElement, 'click');
      fixture.detectChanges();
      expect(component.openChange).toHaveBeenCalledTimes(1);
      expect(component.openChange).toHaveBeenCalledWith(true);
      dispatchFakeEvent(topSelectElement, 'click');
      fixture.detectChanges();
      expect(component.openChange).toHaveBeenCalledTimes(1);
    });
    it('should snCustomTemplate works', fakeAsync(() => {
      component.listOfOption = [{ snValue: 'value', snLabel: 'label' }];
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')).toBeFalsy();
      component.value = 'value';
      component.snCustomTemplate = component.customTemplate;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')!.textContent).toBe('selected: label');
    }));
    it('should snShowArrow works', () => {
      expect(selectElement.querySelector('sn-select-arrow')).toBeTruthy();
      component.snShowArrow = false;
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-arrow')).toBeFalsy();
    });
    it('should snSuffixIcon works', () => {
      expect(selectElement.querySelector('.anticon-down')).toBeTruthy();
      component.snSuffixIcon = component.suffixIconTemplate;
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-arrow')!.textContent).toBe('icon');
    });
    it('should snClearIcon works', fakeAsync(() => {
      component.snAllowClear = true;
      component.listOfOption = [{ snValue: 'value', snLabel: 'label' }];
      component.value = 'value';
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('.anticon-close-circle')).toBeTruthy();
      component.snClearIcon = component.suffixIconTemplate;
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-clear')!.textContent).toBe('icon');
    }));
    it('should snShowSearch works', fakeAsync(() => {
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'test_01' },
        { snValue: 'test_02', snLabel: 'test_02' }
      ];
      component.snShowSearch = true;
      component.snOpen = true;
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.searchValueChange).toHaveBeenCalledWith('test');
      expect(document.querySelectorAll('sn-option-item').length).toBe(2);
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item').length).toBe(1);
    }));
    it('should snFilterOption works', fakeAsync(() => {
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'test_01' },
        { snValue: 'test_02', snLabel: 'test_02' },
        { snValue: 'test_03', snLabel: 'test_03' }
      ];
      component.snShowSearch = true;
      component.snFilterOption = () => true;
      component.snOpen = true;
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item').length).toBe(3);
    }));
    it('should compareWith works', fakeAsync(() => {
      component.listOfOption = [{ snValue: { value: 'test_value' }, snLabel: 'test_label' }];
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')).toBeFalsy();
      component.value = { value: 'test_value' };
      component.compareWith = (o1: SnSafeAny, o2: SnSafeAny) => (o1 && o2 ? o1.value === o2.value : o1 === o2);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')!.textContent).toBe('test_label');
    }));
    it('should snBorderless works', () => {
      expect(selectElement.classList).not.toContain('ant-select-borderless');
      component.snBorderless = true;
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-borderless');
    });
    it('should snAutoFocus works', () => {
      component.snAutoFocus = true;
      fixture.detectChanges();
      expect(selectElement.querySelector('input')!.attributes.getNamedItem('autofocus')!.name).toBe('autofocus');
      component.snAutoFocus = false;
      fixture.detectChanges();
      expect(selectElement.querySelector('input')!.attributes.getNamedItem('autofocus')).toBeFalsy();
    });
    it('should snServerSearch works', fakeAsync(() => {
      component.listOfOption = [
        { snValue: '1', snLabel: '1' },
        { snValue: '2', snLabel: '2' },
        { snValue: '3', snLabel: '3' }
      ];
      component.snServerSearch = true;
      component.snShowSearch = true;
      component.snOpen = true;
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item').length).toBe(3);
    }));
    it('should snDisabled works', fakeAsync(() => {
      component.snDisabled = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-disabled');
      expect(selectElement.querySelector('input')!.getAttribute('disabled')).toBe('');
    }));
    it('should snTitle works', fakeAsync(() => {
      component.listOfOption = [
        { snValue: '1', snLabel: '1' },
        { snValue: '2', snLabel: '2', snTitle: '-' },
        { snValue: '3', snLabel: '3', snTitle: null }
      ];
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      console.log(document.querySelectorAll('sn-option-item'));
      expect((document.querySelectorAll('sn-option-item')[0] as HTMLElement)?.title).toBe('1');
      expect((document.querySelectorAll('sn-option-item')[1] as HTMLElement)?.title).toBe('-');
      expect((document.querySelectorAll('sn-option-item')[2] as HTMLElement)?.title).toBeFalsy();
    }));

    it('should select option by enter', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.listOfOption = [
        { snValue: 'value', snLabel: 'label' },
        { snValue: 'disabledValue', snLabel: 'disabledLabel', snDisabled: true }
      ];
      component.snShowSearch = true;
      component.snOpen = true;

      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label';

      dispatchFakeEvent(inputElement, 'input');
      flushChanges();
      expect(component.searchValueChange).toHaveBeenCalledWith('label');

      dispatchKeyboardEvent(inputElement, 'keydown', ENTER, inputElement);
      flushChanges();
      expect(component.value).toBe('value');
    }));

    it('should snDisabled option works', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.listOfOption = [
        { snValue: 'value', snLabel: 'label' },
        { snValue: 'disabledValue', snLabel: 'disabledLabel', snDisabled: true }
      ];
      component.snShowSearch = true;
      component.snOpen = true;

      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'disabled';

      dispatchFakeEvent(inputElement, 'input');
      flushChanges();
      expect(component.searchValueChange).toHaveBeenCalledWith('disabled');

      dispatchKeyboardEvent(inputElement, 'keydown', ENTER, inputElement);
      flushChanges();
      expect(component.value).not.toBe('disabledValue');
    }));

    it('should snBackdrop works', fakeAsync(() => {
      component.snOpen = true;
      component.snBackdrop = true;
      fixture.detectChanges();
      flush();
      expect(overlayContainerElement.children[0].classList).toContain('cdk-overlay-backdrop');
    }));

    it('should close dropdown when ESC keydown', fakeAsync(() => {
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      dispatchKeyboardEvent(overlayContainerElement, 'keydown', ESCAPE, overlayContainerElement);

      fixture.detectChanges();
      flush();
      fixture.detectChanges();

      expect(component.snOpen).toBe(false);
    }));

    it('should keydown up arrow and down arrow', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.listOfOption = [
        { snValue: 'value_01', snLabel: 'label_01' },
        { snValue: 'value_02', snLabel: 'label_02', snDisabled: true },
        { snValue: 'value_03', snLabel: 'label_03' }
      ];
      component.value = 'value_01';
      component.snOpen = true;
      flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', UP_ARROW, inputElement);
      flushChanges();
      expect(document.querySelectorAll('sn-option-item')[2]!.classList).toContain('ant-select-item-option-active');
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      flushChanges();
      expect(document.querySelectorAll('sn-option-item')[0]!.classList).toContain('ant-select-item-option-active');
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', ENTER, inputElement);
      flushChanges();
      expect(component.valueChange).toHaveBeenCalledWith('value_03');
      flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', SPACE, inputElement);
      flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      dispatchKeyboardEvent(inputElement, 'keydown', SPACE, inputElement);
      flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(true);
      dispatchKeyboardEvent(inputElement, 'keydown', TAB, inputElement);
      flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      expect(component.openChange).toHaveBeenCalledTimes(3);
    }));

    it('should not throw error with keydown up arrow and down arrow event when listOfOption is empty', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.listOfOption = [];
      component.snOpen = true;
      flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', UP_ARROW, inputElement);
      flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      flushChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(0);
    }));

    it('should mouseenter activated option work', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.listOfOption = [
        { snValue: 'value_01', snLabel: 'label_01' },
        { snValue: 'value_02', snLabel: 'label_02', snDisabled: true },
        { snValue: 'value_03', snLabel: 'label_03' }
      ];
      component.snOpen = true;
      flushChanges();
      const targetItem = document.querySelectorAll('sn-option-item')[2]!;
      expect(targetItem.classList).not.toContain('ant-select-item-option-active');
      dispatchFakeEvent(targetItem, 'mouseenter');
      flushChanges();
      expect(targetItem.classList).toContain('ant-select-item-option-active');
    }));

    it('should group item change work', fakeAsync(() => {
      component.listOfGroup = [{ snLabel: 'group-1', children: [{ snValue: 'value_01', snLabel: 'label_01' }] }];
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item')!.length).toBe(1);
      expect(document.querySelectorAll('sn-option-item-group')!.length).toBe(1);
      component.listOfGroup = [
        {
          snLabel: 'group-1',
          children: [
            { snValue: 'value_01', snLabel: 'label_01' },
            { snValue: 'value_02', snLabel: 'label_02' }
          ]
        },
        {
          snLabel: 'group-2',
          children: [{ snValue: 'value_03', snLabel: 'label_03' }]
        }
      ];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item')!.length).toBe(3);
      expect(document.querySelectorAll('sn-option-item-group')!.length).toBe(2);
      expect(document.querySelectorAll('sn-option-item-group')[0]!.textContent).toBe('group-1');
      expect(document.querySelectorAll('sn-option-item')[0].textContent).toBe('label_01');
      component.listOfGroup[0].snLabel = 'change-group';
      component.listOfGroup[0].children[0].snLabel = 'change-label';
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item-group')[0]!.textContent).toBe('change-group');
      expect(document.querySelectorAll('sn-option-item')[0].textContent).toBe('change-label');
    }));

    it('should group item sort be right', fakeAsync(() => {
      component.listOfGroup = [
        {
          snLabel: 'group-1',
          children: [
            { snValue: 'value_01', snLabel: 'label_01' },
            { snValue: 'value_02', snLabel: 'label_02' }
          ]
        },
        {
          snLabel: 'group-2',
          children: [
            { snValue: 'value_03', snLabel: 'label_03' },
            { snValue: 'value_04', snLabel: 'label_04' }
          ]
        }
      ];
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(
        document.querySelectorAll('sn-option-item')[0].parentElement!.querySelector('sn-option-item')!
          .nextElementSibling!.textContent
      ).toBe('label_02');
    }));

    it('should have selected class if item was selected', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.listOfOption = [
        { snValue: 0, snLabel: 'Falsy value' },
        { snValue: 'Truthy value', snLabel: 'Truthy value' },
        { snValue: 'disabled', snLabel: 'disabled', snDisabled: true },
        { snValue: undefined, snLabel: 'undefined' },
        { snValue: null, snLabel: 'null' }
      ];
      component.snOpen = true;
      component.value = 0;
      flushChanges();
      expect(document.querySelectorAll('sn-option-item.ant-select-item-option-selected').length).toBe(1);
      expect(document.querySelectorAll('sn-option-item.ant-select-item-option-selected')[0].textContent).toBe(
        'Falsy value'
      );
      component.value = 'Truthy value';
      flushChanges();
      expect(document.querySelectorAll('sn-option-item.ant-select-item-option-selected').length).toBe(1);
      expect(document.querySelectorAll('sn-option-item.ant-select-item-option-selected')[0].textContent).toBe(
        'Truthy value'
      );
      ['disabled', undefined, null].forEach(value => {
        component.value = value;
        flushChanges();
        expect(document.querySelectorAll('sn-option-item.ant-select-item-option-selected').length).toBe(0);
      });
    }));
    it('should select item on TAB when snSelectOnTab is true', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.snSelectOnTab = true;
      component.listOfOption = [
        { snValue: 'value_01', snLabel: 'label_01' },
        { snValue: 'value_02', snLabel: 'label_02' },
        { snValue: 'value_03', snLabel: 'label_03' }
      ];
      component.snOpen = true;
      flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', TAB, inputElement);
      flushChanges();
      expect(component.valueChange).toHaveBeenCalledWith('value_01');
      flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      expect(component.openChange).toHaveBeenCalledTimes(1);
    }));
    it('should close select and keep the same value on TAB when snSelectOnTab is default(false)', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.listOfOption = [
        { snValue: 'value_01', snLabel: 'label_01' },
        { snValue: 'value_02', snLabel: 'label_02' },
        { snValue: 'value_03', snLabel: 'label_03' }
      ];
      component.value = 'value_02';
      component.snOpen = true;
      flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', TAB, inputElement);
      flushChanges();
      expect(component.valueChange).not.toHaveBeenCalled();
      flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      expect(component.openChange).toHaveBeenCalledTimes(1);
    }));
  });
  describe('multiple template mode', () => {
    let testBed: ComponentBed<TestSelectTemplateMultipleComponent>;
    let component: TestSelectTemplateMultipleComponent;
    let fixture: ComponentFixture<TestSelectTemplateMultipleComponent>;
    let selectElement!: HTMLElement;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
      testBed = createComponentBed(TestSelectTemplateMultipleComponent, {
        imports: [SnSelectModule, SnIconTestModule, FormsModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
      selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
      overlayContainerElement = TestBed.inject(OverlayContainer).getContainerElement();
    });
    it('should classname correct', () => {
      expect(selectElement.classList).toContain('ant-select-multiple');
    });
    it('should ngModel works', fakeAsync(() => {
      component.listOfOption = [
        { snValue: 'value_01', snLabel: 'label_01' },
        { snValue: 'value_02', snLabel: 'label_02' }
      ];
      component.value = ['value_01', 'value_02'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      let listOfSelectItem = selectElement.querySelectorAll('sn-select-item')!;
      expect(listOfSelectItem.length).toBe(2);
      expect(listOfSelectItem[0].textContent).toBe('label_01');
      expect(listOfSelectItem[1].textContent).toBe('label_02');
      component.listOfOption = [{ snValue: 'value_01', snLabel: 'label_01' }];
      fixture.detectChanges();
      listOfSelectItem = selectElement.querySelectorAll('sn-select-item')!;
      expect(listOfSelectItem.length).toBe(2);
      expect(listOfSelectItem[0].textContent).toBe('label_01');
      expect(listOfSelectItem[1].textContent).toBe('label_02');
      expect(component.valueChange).not.toHaveBeenCalled();
    }));
    it('should click option work', fakeAsync(() => {
      const flushRefresh = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.snOpen = true;
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'test_01' },
        { snValue: 'test_02', snLabel: 'test_02' }
      ];
      component.value = ['test_01'];
      flushRefresh();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      flushRefresh();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.value.length).toBe(2);
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      flushRefresh();
      expect(component.valueChange).toHaveBeenCalledTimes(2);
      expect(component.value.length).toBe(1);
      expect(component.value[0]).toBe('test_01');
      expect(component.openChange).not.toHaveBeenCalled();
    }));
    it('should compareWith works', fakeAsync(() => {
      component.listOfOption = [{ snValue: { value: 'value' }, snLabel: 'label' }];
      fixture.detectChanges();
      expect(selectElement.querySelectorAll('sn-select-item').length).toBe(0);
      component.value = [{ value: 'value' }];
      component.compareWith = (o1: SnSafeAny, o2: SnSafeAny) => (o1 && o2 ? o1.value === o2.value : o1 === o2);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelectorAll('sn-select-item').length).toBe(1);
      expect(selectElement.querySelectorAll('sn-select-item')[0].textContent).toBe('label');
    }));
    it('should snMenuItemSelectedIcon works', fakeAsync(() => {
      component.listOfOption = [{ snValue: 'value', snLabel: 'label' }];
      component.value = ['value'];
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('.ant-select-selected-icon').length).toBe(1);
      component.snMenuItemSelectedIcon = component.iconTemplate;
      fixture.detectChanges();
      expect(document.querySelectorAll('.ant-select-selected-icon').length).toBe(0);
      expect(document.querySelector('.ant-select-item-option-state')!.textContent).toBe('icon');
    }));
    it('should removeIcon works', fakeAsync(() => {
      component.listOfOption = [{ snValue: 'value', snLabel: 'label' }];
      component.value = ['value'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('.anticon-close')).toBeTruthy();
      component.snRemoveIcon = component.iconTemplate;
      fixture.detectChanges();
      expect(selectElement.querySelector('.ant-select-selection-item-remove')!.textContent).toBe('icon');
    }));
    it('should removeIcon click works', fakeAsync(() => {
      component.listOfOption = [{ snValue: 'value', snLabel: 'label' }];
      component.value = ['value'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      dispatchFakeEvent(selectElement.querySelector('.anticon-close')!, 'click');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.value.length).toBe(0);
    }));
    it('should backspace works', fakeAsync(() => {
      component.listOfOption = [{ snValue: 'value', snLabel: 'label' }];
      component.value = ['value'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', BACKSPACE, inputElement);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.value.length).toBe(0);
    }));
    it('should snTokenSeparators work', fakeAsync(() => {
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'label_01' },
        { snValue: 'test_02', snLabel: 'label_02' }
      ];
      component.value = [];
      component.snTokenSeparators = [','];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,test_02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.value.length).toBe(1);
      expect(component.value[0]).toBe('test_01');
    }));
    it('should snMaxMultipleCount work', fakeAsync(() => {
      const flushRefresh = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.snOpen = true;
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'test_01' },
        { snValue: 'test_02', snLabel: 'test_02' }
      ];
      component.value = [];
      component.snMaxMultipleCount = 1;
      flushRefresh();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      flushRefresh();
      expect(component.value.length).toBe(1);
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      flushRefresh();
      expect(component.value.length).toBe(1);
      expect(component.value[0]).toBe('test_01');
    }));
    it('should snAutoClearSearchValue work', fakeAsync(() => {
      const flushRefresh = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.snOpen = true;
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'test_01' },
        { snValue: 'test_02', snLabel: 'test_02' }
      ];
      flushRefresh();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      flushRefresh();
      expect(inputElement.value).toBe('');
      component.snAutoClearSearchValue = false;
      flushRefresh();
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      flushRefresh();
      expect(inputElement.value).toBe('test');
    }));
    it('should snAutoClearSearchValue work when cdkOverlay send emit close', fakeAsync(() => {
      const flushRefresh = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.snOpen = true;
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'test_01' },
        { snValue: 'test_02', snLabel: 'test_02' }
      ];
      flushRefresh();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      flushRefresh();
      expect(inputElement.value).toBe('');
      component.snAutoClearSearchValue = false;
      flushRefresh();
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchKeyboardEvent(overlayContainerElement, 'keydown', ESCAPE, overlayContainerElement);
      fixture.detectChanges();
      flushRefresh();
      fixture.detectChanges();
      expect(inputElement.value).toBe('test');
    }));
  });
  describe('tags template mode', () => {
    let testBed: ComponentBed<TestSelectTemplateTagsComponent>;
    let component: TestSelectTemplateTagsComponent;
    let fixture: ComponentFixture<TestSelectTemplateTagsComponent>;
    let selectElement!: HTMLElement;
    beforeEach(() => {
      testBed = createComponentBed(TestSelectTemplateTagsComponent, {
        imports: [SnSelectModule, SnIconTestModule, FormsModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
      selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
    });
    it('should classname correct', () => {
      expect(selectElement.classList).toContain('ant-select-multiple');
    });
    it('should snTokenSeparators works', fakeAsync(() => {
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'label_01' },
        { snValue: 'test_02', snLabel: 'label_02' }
      ];
      component.value = [];
      component.snTokenSeparators = [','];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,test_02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.value.length).toBe(2);
      expect(component.value[0]).toBe('test_01');
      expect(component.value[1]).toBe('test_02');
    }));
    it('should snMaxTagCount works', fakeAsync(() => {
      component.listOfOption = [
        { snValue: 'test_01', snLabel: 'label_01' },
        { snValue: 'test_02', snLabel: 'label_02' },
        { snValue: 'test_03', snLabel: 'label_03' },
        { snValue: 'test_04', snLabel: 'label_04' }
      ];
      component.value = ['test_01', 'test_02', 'test_03', 'test_04'];
      component.snMaxTagCount = 2;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const listOfItem = selectElement.querySelectorAll('sn-select-item');
      expect(listOfItem.length).toBe(3);
      expect(listOfItem[2].querySelector('.ant-select-selection-item-content')!.textContent).toBe('+ 2 ...');
      component.snMaxTagPlaceholder = component.tagTemplate;
      fixture.detectChanges();
      expect(listOfItem[2].textContent).toBe('and 2 more selected');
    }));
  });
  describe('default reactive mode', () => {
    let testBed: ComponentBed<TestSelectReactiveDefaultComponent>;
    let component: TestSelectReactiveDefaultComponent;
    let fixture: ComponentFixture<TestSelectReactiveDefaultComponent>;
    let selectElement!: HTMLElement;
    beforeEach(() => {
      testBed = createComponentBed(TestSelectReactiveDefaultComponent, {
        imports: [SnSelectModule, SnIconTestModule, FormsModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
      selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
    });
    it('should ngModel match snLabel', fakeAsync(() => {
      component.listOfOption = [{ value: 'test_value', label: 'test_label' }];
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')).toBeFalsy();
      component.value = 'test_value';
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')!.textContent).toBe('test_label');
      component.listOfOption = [];
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')!.textContent).toBe('test_label');
      expect(component.valueChange).not.toHaveBeenCalled();
    }));
    it('should ngModelChange trigger when click option', fakeAsync(() => {
      component.listOfOption = [
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ];
      component.value = 'test_01';
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.valueChange).toHaveBeenCalledWith('test_02');
      expect(component.openChange).toHaveBeenCalledTimes(1);
      expect(component.openChange).toHaveBeenCalledWith(false);
    }));
    it('should ngModelChange trigger when click clear icon', fakeAsync(() => {
      component.listOfOption = [{ value: 'test_value', label: 'test_label' }];
      component.value = 'test_value';
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-clear')).toBeFalsy();
      component.snAllowClear = true;
      fixture.detectChanges();
      dispatchMouseEvent(selectElement.querySelector('sn-select-clear')!, 'click');
      fixture.detectChanges();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.valueChange).toHaveBeenCalledWith(null);
    }));
    it('should snCustomTemplate works', fakeAsync(() => {
      component.listOfOption = [{ value: 'value', label: 'label' }];
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')).toBeFalsy();
      component.value = 'value';
      component.snCustomTemplate = component.customTemplate;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')!.textContent).toBe('selected: label');
    }));
    it('should snShowSearch works', fakeAsync(() => {
      component.listOfOption = [
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ];
      component.snShowSearch = true;
      component.snOpen = true;
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.searchValueChange).toHaveBeenCalledWith('test');
      expect(document.querySelectorAll('sn-option-item').length).toBe(2);
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item').length).toBe(1);
    }));
    it('should snFilterOption works', fakeAsync(() => {
      component.listOfOption = [
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' },
        { value: 'test_03', label: 'test_03' }
      ];
      component.snShowSearch = true;
      component.snFilterOption = () => true;
      component.snOpen = true;
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item').length).toBe(3);
    }));
    it('should compareWith works', fakeAsync(() => {
      component.listOfOption = [{ value: { value: 'test_value' }, label: 'test_label' }];
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')).toBeFalsy();
      component.value = { value: 'test_value' };
      component.compareWith = (o1: SnSafeAny, o2: SnSafeAny) => (o1 && o2 ? o1.value === o2.value : o1 === o2);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-item')!.textContent).toBe('test_label');
    }));
    it('should snServerSearch works', fakeAsync(() => {
      component.listOfOption = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }
      ];
      component.snServerSearch = true;
      component.snShowSearch = true;
      component.snOpen = true;
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = '02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item').length).toBe(3);
    }));
    it('should keydown up arrow and down arrow', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.listOfOption = [
        { value: 'value_01', label: 'label_01' },
        { value: 'value_02', label: 'label_02', disabled: true },
        { value: 'value_03', label: 'label_03' }
      ];
      component.value = 'value_01';
      component.snOpen = true;
      flushChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', UP_ARROW, inputElement);
      flushChanges();
      expect(document.querySelectorAll('sn-option-item')[2]!.classList).toContain('ant-select-item-option-active');
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      flushChanges();
      expect(document.querySelectorAll('sn-option-item')[0]!.classList).toContain('ant-select-item-option-active');
      dispatchKeyboardEvent(inputElement, 'keydown', DOWN_ARROW, inputElement);
      flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', ENTER, inputElement);
      flushChanges();
      expect(component.valueChange).toHaveBeenCalledWith('value_03');
      flushChanges();
      dispatchKeyboardEvent(inputElement, 'keydown', SPACE, inputElement);
      flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      dispatchKeyboardEvent(inputElement, 'keydown', SPACE, inputElement);
      flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(true);
      dispatchKeyboardEvent(inputElement, 'keydown', TAB, inputElement);
      flushChanges();
      expect(component.openChange).toHaveBeenCalledWith(false);
      expect(component.openChange).toHaveBeenCalledTimes(3);
    }));
    it('should mouseenter activated option work', fakeAsync(() => {
      const flushChanges = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.listOfOption = [
        { value: 'value_01', label: 'label_01' },
        { value: 'value_02', label: 'label_02', disabled: true },
        { value: 'value_03', label: 'label_03' }
      ];
      component.snOpen = true;
      flushChanges();
      const targetItem = document.querySelectorAll('sn-option-item')[2]!;
      expect(targetItem.classList).not.toContain('ant-select-item-option-active');
      dispatchFakeEvent(targetItem, 'mouseenter');
      flushChanges();
      expect(targetItem.classList).toContain('ant-select-item-option-active');
    }));

    it('should group item change work', fakeAsync(() => {
      component.listOfOption = [{ groupLabel: 'group-1', value: 'value_01', label: 'label_01' }];
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item')!.length).toBe(1);
      expect(document.querySelectorAll('sn-option-item-group')!.length).toBe(1);
      component.listOfOption = [
        { value: 'value_01', label: 'label_01', groupLabel: 'group-1' },
        { value: 'value_02', label: 'label_02', groupLabel: 'group-1' },
        { value: 'value_03', label: 'label_03', groupLabel: 'group-2' }
      ];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item')!.length).toBe(3);
      expect(document.querySelectorAll('sn-option-item-group')!.length).toBe(2);
      expect(document.querySelectorAll('sn-option-item-group')[0]!.textContent).toBe('group-1');
      expect(document.querySelectorAll('sn-option-item')[0].textContent).toBe('label_01');
      component.listOfOption = [{ groupLabel: 'change-group', value: 'value_01', label: 'change-label' }];

      fixture.detectChanges();
      expect(document.querySelectorAll('sn-option-item-group')[0]!.textContent).toBe('change-group');
      expect(document.querySelectorAll('sn-option-item')[0].textContent).toBe('change-label');
    }));

    it('should group item sort be right', fakeAsync(() => {
      component.listOfOption = [
        { value: 'value_01', label: 'label_01', groupLabel: 'group-1' },
        { value: 'value_02', label: 'label_02', groupLabel: 'group-1' },
        { value: 'value_03', label: 'label_03', groupLabel: 'group-2' },
        { value: 'value_04', label: 'label_04', groupLabel: 'group-2' }
      ];
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(
        document.querySelectorAll('sn-option-item')[0].parentElement!.querySelector('sn-option-item')!
          .nextElementSibling!.textContent
      ).toBe('label_02');
    }));
  });
  describe('multiple reactive mode', () => {
    let testBed: ComponentBed<TestSelectReactiveMultipleComponent>;
    let component: TestSelectReactiveMultipleComponent;
    let fixture: ComponentFixture<TestSelectReactiveMultipleComponent>;
    let selectElement!: HTMLElement;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
      testBed = createComponentBed(TestSelectReactiveMultipleComponent, {
        imports: [SnSelectModule, SnIconTestModule, FormsModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
      selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
      overlayContainerElement = TestBed.inject(OverlayContainer).getContainerElement();
    });
    it('should ngModel works', fakeAsync(() => {
      component.listOfOption = [
        { value: 'value_01', label: 'label_01' },
        { value: 'value_02', label: 'label_02' }
      ];
      component.value = ['value_01', 'value_02'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      let listOfSelectItem = selectElement.querySelectorAll('sn-select-item')!;
      expect(listOfSelectItem.length).toBe(2);
      expect(listOfSelectItem[0].textContent).toBe('label_01');
      expect(listOfSelectItem[1].textContent).toBe('label_02');
      component.listOfOption = [{ value: 'value_01', label: 'label_01' }];
      fixture.detectChanges();
      listOfSelectItem = selectElement.querySelectorAll('sn-select-item')!;
      expect(listOfSelectItem.length).toBe(2);
      expect(listOfSelectItem[0].textContent).toBe('label_01');
      expect(listOfSelectItem[1].textContent).toBe('label_02');
      expect(component.valueChange).not.toHaveBeenCalled();
    }));
    it('should click option work', fakeAsync(() => {
      const flushRefresh = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.snOpen = true;
      component.listOfOption = [
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ];
      component.value = ['test_01'];
      flushRefresh();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      flushRefresh();
      expect(component.valueChange).toHaveBeenCalledTimes(1);
      expect(component.value.length).toBe(2);
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      flushRefresh();
      expect(component.valueChange).toHaveBeenCalledTimes(2);
      expect(component.value.length).toBe(1);
      expect(component.value[0]).toBe('test_01');
      expect(component.openChange).not.toHaveBeenCalled();
    }));
    it('should compareWith works', fakeAsync(() => {
      component.listOfOption = [{ value: { value: 'value' }, label: 'label' }];
      fixture.detectChanges();
      expect(selectElement.querySelectorAll('sn-select-item').length).toBe(0);
      component.value = [{ value: 'value' }];
      component.compareWith = (o1: SnSafeAny, o2: SnSafeAny) => (o1 && o2 ? o1.value === o2.value : o1 === o2);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelectorAll('sn-select-item').length).toBe(1);
      expect(selectElement.querySelectorAll('sn-select-item')[0].textContent).toBe('label');
    }));
    it('should snMenuItemSelectedIcon works', fakeAsync(() => {
      component.listOfOption = [{ value: 'value', label: 'label' }];
      component.value = ['value'];
      component.snOpen = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(document.querySelectorAll('.ant-select-selected-icon').length).toBe(1);
      component.snMenuItemSelectedIcon = component.iconTemplate;
      fixture.detectChanges();
      expect(document.querySelectorAll('.ant-select-selected-icon').length).toBe(0);
      expect(document.querySelector('.ant-select-item-option-state')!.textContent).toBe('icon');
    }));
    it('should removeIcon works', fakeAsync(() => {
      component.listOfOption = [{ value: 'value', label: 'label' }];
      component.value = ['value'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(selectElement.querySelector('.anticon-close')).toBeTruthy();
      component.snRemoveIcon = component.iconTemplate;
      fixture.detectChanges();
      expect(selectElement.querySelector('.ant-select-selection-item-remove')!.textContent).toBe('icon');
    }));
    it('should removeIcon click works', fakeAsync(() => {
      component.listOfOption = [{ value: 'value', label: 'label' }];
      component.value = ['value'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      dispatchFakeEvent(selectElement.querySelector('.anticon-close')!, 'click');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.value.length).toBe(0);
    }));
    it('should backspace works', fakeAsync(() => {
      component.listOfOption = [{ value: 'value', label: 'label' }];
      component.value = ['value'];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      dispatchKeyboardEvent(inputElement, 'keydown', BACKSPACE, inputElement);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.value.length).toBe(0);
    }));
    it('should snTokenSeparators work', fakeAsync(() => {
      component.listOfOption = [
        { value: 'test_01', label: 'label_01' },
        { value: 'test_02', label: 'label_02' }
      ];
      component.value = [];
      component.snTokenSeparators = [','];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,test_02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.value.length).toBe(1);
      expect(component.value[0]).toBe('test_01');
    }));
    it('should snMaxMultipleCount work', fakeAsync(() => {
      const flushRefresh = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.snOpen = true;
      component.listOfOption = [
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ];
      component.value = [];
      component.snMaxMultipleCount = 1;
      flushRefresh();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      flushRefresh();
      expect(component.value.length).toBe(1);
      dispatchMouseEvent(listOfContainerItem[1], 'click');
      flushRefresh();
      expect(component.value.length).toBe(1);
      expect(component.value[0]).toBe('test_01');
      expect(listOfContainerItem[1]).toHaveClass('ant-select-item-option-disabled');
    }));
    it('should show snShowArrow component when having snMaxMultipleCount', () => {
      component.snMaxMultipleCount = 0;
      expect(selectElement.querySelector('sn-select-arrow')).toBeFalsy();
      component.snMaxMultipleCount = 1;
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-select-arrow')).toBeTruthy();
    });
    it('should snAutoClearSearchValue work', fakeAsync(() => {
      const flushRefresh = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.snOpen = true;
      component.listOfOption = [
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ];
      flushRefresh();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      flushRefresh();
      expect(inputElement.value).toBe('');
      component.snAutoClearSearchValue = false;
      flushRefresh();
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      flushRefresh();
      expect(inputElement.value).toBe('test');
    }));
    it('should snAutoClearSearchValue work when cdkOverlay send emit close', fakeAsync(() => {
      const flushRefresh = (): void => {
        fixture.detectChanges();
        flush();
        fixture.detectChanges();
      };
      component.snOpen = true;
      component.listOfOption = [
        { value: 'test_01', label: 'test_01' },
        { value: 'test_02', label: 'test_02' }
      ];
      flushRefresh();
      const listOfContainerItem = document.querySelectorAll('sn-option-item');
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchMouseEvent(listOfContainerItem[0], 'click');
      flushRefresh();
      expect(inputElement.value).toBe('');
      component.snAutoClearSearchValue = false;
      flushRefresh();
      inputElement.value = 'test';
      dispatchFakeEvent(inputElement, 'input');
      dispatchKeyboardEvent(overlayContainerElement, 'keydown', ESCAPE, overlayContainerElement);
      fixture.detectChanges();
      flushRefresh();
      fixture.detectChanges();
      expect(inputElement.value).toBe('test');
    }));
  });
  describe('tags reactive mode', () => {
    let testBed: ComponentBed<TestSelectReactiveTagsComponent>;
    let component: TestSelectReactiveTagsComponent;
    let fixture: ComponentFixture<TestSelectReactiveTagsComponent>;
    let selectElement!: HTMLElement;
    beforeEach(() => {
      testBed = createComponentBed(TestSelectReactiveTagsComponent, {
        imports: [SnSelectModule, SnIconTestModule, FormsModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
      selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
    });
    it('should snTokenSeparators works', fakeAsync(() => {
      component.listOfOption = [
        { value: 'test_01', label: 'label_01' },
        { value: 'test_02', label: 'label_02' }
      ];
      component.value = [];
      component.snTokenSeparators = [','];
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const inputElement = selectElement.querySelector('input')!;
      inputElement.value = 'label_01,test_02';
      dispatchFakeEvent(inputElement, 'input');
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(component.value.length).toBe(2);
      expect(component.value[0]).toBe('test_01');
      expect(component.value[1]).toBe('test_02');
    }));
    it('should snMaxTagCount works', fakeAsync(() => {
      component.listOfOption = [
        { value: 'test_01', label: 'label_01' },
        { value: 'test_02', label: 'label_02' },
        { value: 'test_03', label: 'label_03' },
        { value: 'test_04', label: 'label_04' }
      ];
      component.value = ['test_01', 'test_02', 'test_03', 'test_04'];
      component.snMaxTagCount = 2;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const listOfItem = selectElement.querySelectorAll('sn-select-item');
      expect(listOfItem.length).toBe(3);
      expect(listOfItem[2].querySelector('.ant-select-selection-item-content')!.textContent).toBe('+ 2 ...');
      component.snMaxTagPlaceholder = component.tagTemplate;
      fixture.detectChanges();
      expect(listOfItem[2].textContent).toBe('and 2 more selected');
    }));
  });
  describe('change detection', () => {
    let testBed: ComponentBed<TestSelectTemplateDefaultComponent>;
    let component: TestSelectTemplateDefaultComponent;
    let fixture: ComponentFixture<TestSelectTemplateDefaultComponent>;
    let selectComponent: SnSelectComponent;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
      testBed = createComponentBed(TestSelectTemplateDefaultComponent, {
        imports: [SnSelectModule, SnIconTestModule, FormsModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
      selectComponent = testBed.debugElement.query(By.directive(SnSelectComponent)).componentInstance;
    });

    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    }));

    it('should not run change detection if the `triggerWidth` has not been changed', fakeAsync(() => {
      const detectChangesSpy = spyOn(selectComponent['cdr'], 'detectChanges').and.callThrough();
      // const requestAnimationFrameSpy = spyOn(window, 'requestAnimationFrame').and.callThrough(); this test is totally instable depends the order of execution

      component.snOpen = true;
      fixture.detectChanges();
      // The `requestAnimationFrame` is simulated as `setTimeout(..., 16)` inside the `fakeAsync`.
      tick(16);

      dispatchKeyboardEvent(overlayContainerElement, 'keydown', ESCAPE, overlayContainerElement);
      fixture.detectChanges();
      flush();

      expect(component.snOpen).toEqual(false);

      component.snOpen = true;
      fixture.detectChanges();
      tick(16);

      // Ensure that the `detectChanges()` have been called only once since the `triggerWidth` hasn't been changed.
      expect(detectChangesSpy).toHaveBeenCalledTimes(1);
      // expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(2);
    }));

    it('should isMaxTagCountSet work correct', () => {
      component.snMaxMultipleCount = Infinity;
      fixture.detectChanges();
      let isMaxTagCountSet;
      isMaxTagCountSet = selectComponent['isMaxTagCountSet'];
      expect(isMaxTagCountSet).toBeFalsy();

      component.snMaxMultipleCount = 1;
      fixture.detectChanges();
      isMaxTagCountSet = selectComponent['isMaxTagCountSet'];
      expect(isMaxTagCountSet).toBeTruthy();
    });

    it('should isMaxLimitReached be set correctly', () => {
      selectComponent.snMaxMultipleCount = 2;
      selectComponent.listOfValue = ['a', 'b'];
      fixture.detectChanges();
      selectComponent.updateListOfValue(['a', 'b']);
      expect(selectComponent.isMaxLimitReached).toBeTruthy();

      selectComponent.snMaxMultipleCount = 20;
      selectComponent.listOfValue = ['a', 'b'];
      fixture.detectChanges();
      selectComponent.updateListOfValue(['a', 'b']);
      expect(selectComponent.isMaxLimitReached).toBeFalsy();
    });

    it('should not run change detection when `sn-select-top-control` is clicked and should focus the `sn-select-search`', () => {
      const appRef = TestBed.inject(ApplicationRef);
      spyOn(appRef, 'tick');

      const snSelectSearch = fixture.debugElement.query(By.directive(SnSelectSearchComponent));
      spyOn(snSelectSearch.componentInstance, 'focus');

      const snSelectTopControl = fixture.debugElement.query(By.directive(SnSelectTopControlComponent));
      dispatchMouseEvent(snSelectTopControl.nativeElement, 'click');

      expect(appRef.tick).toHaveBeenCalledTimes(0);
      expect(snSelectSearch.componentInstance.focus).toHaveBeenCalled();
    });

    it('should not run change detection when non-backspace button is pressed on the `sn-select-top-control`', () => {
      const appRef = TestBed.inject(ApplicationRef);
      spyOn(appRef, 'tick');

      const snSelectTopControl = fixture.debugElement.query(By.directive(SnSelectTopControlComponent));
      dispatchKeyboardEvent(snSelectTopControl.nativeElement, 'keydown', TAB, snSelectTopControl.nativeElement);

      expect(appRef.tick).toHaveBeenCalledTimes(0);
    });
  });
  describe('status', () => {
    let testBed: ComponentBed<TestSelectStatusComponent>;
    let component: TestSelectStatusComponent;
    let fixture: ComponentFixture<TestSelectStatusComponent>;
    let selectElement!: HTMLElement;

    beforeEach(() => {
      testBed = createComponentBed(TestSelectStatusComponent, {
        imports: [SnSelectModule, SnIconTestModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
      selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
    });

    it('should classname correct', () => {
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-status-error');

      component.status = 'warning';
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-status-warning');

      component.status = '';
      fixture.detectChanges();
      expect(selectElement.classList).not.toContain('ant-select-status-warning');
    });
  });
  describe('in form', () => {
    let testBed: ComponentBed<TestSelectInFormComponent>;
    let component: TestSelectInFormComponent;
    let fixture: ComponentFixture<TestSelectInFormComponent>;

    beforeEach(() => {
      testBed = createComponentBed(TestSelectInFormComponent, {
        imports: [SnSelectModule, SnIconTestModule, SnFormModule, ReactiveFormsModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
    });
    it('should classname correct and be disable initially', () => {
      fixture.detectChanges();
      const selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
      const inputElement = testBed.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;

      expect(inputElement.disabled).toBeFalsy();
      expect(selectElement.classList).not.toContain('ant-select-disabled');
      expect(selectElement.classList).toContain('ant-select-status-error');
      expect(selectElement.classList).toContain('ant-select-in-form-item');
      expect(selectElement.querySelector('sn-form-item-feedback-icon')).toBeTruthy();

      component.status = 'warning';
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-status-warning');

      component.status = 'success';
      fixture.detectChanges();
      expect(selectElement.classList).toContain('ant-select-status-success');

      component.feedback = false;
      fixture.detectChanges();
      expect(selectElement.querySelector('sn-form-item-feedback-icon')).toBeNull();
    });
    it('should be disable by default even if form is enable', fakeAsync(() => {
      component.disabled = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
      const inputElement = testBed.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      expect(inputElement.disabled).toBeTruthy();
      expect(selectElement.classList).toContain('ant-select-disabled');
    }));
    it('should be disable if form is disabled and snDisabled set to false', fakeAsync(() => {
      component.disable();
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      const selectElement = testBed.debugElement.query(By.directive(SnSelectComponent)).nativeElement;
      const inputElement = testBed.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
      expect(inputElement.disabled).toBeTruthy();
      expect(selectElement.classList).toContain('ant-select-disabled');
    }));
  });
  describe('placement', () => {
    let testBed: ComponentBed<TestSelectTemplateDefaultComponent>;
    let component: TestSelectTemplateDefaultComponent;
    let fixture: ComponentFixture<TestSelectTemplateDefaultComponent>;
    let overlayContainerElement: HTMLElement;

    beforeEach(() => {
      testBed = createComponentBed(TestSelectTemplateDefaultComponent, {
        imports: [SnSelectModule, SnIconTestModule, FormsModule]
      });
      component = testBed.component;
      fixture = testBed.fixture;
    });

    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    }));

    it('should snPlacement work', fakeAsync(() => {
      component.snOpen = true;
      fixture.detectChanges();
      let element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(true);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(false);
      component.snOpen = false;
      component.snPlacement = 'bottomRight';
      fixture.detectChanges();
      component.snOpen = true;
      tick();
      fixture.detectChanges();
      element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(true);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(false);
      component.snOpen = false;
      component.snPlacement = 'topLeft';
      fixture.detectChanges();
      component.snOpen = true;
      tick();
      fixture.detectChanges();
      element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(true);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(false);
      component.snOpen = false;
      component.snPlacement = 'topRight';
      fixture.detectChanges();
      component.snOpen = true;
      tick();
      fixture.detectChanges();
      element = overlayContainerElement.querySelector('.ant-select-dropdown') as HTMLElement;
      expect(element.classList.contains('ant-select-dropdown-placement-bottomLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-bottomRight')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topLeft')).toBe(false);
      expect(element.classList.contains('ant-select-dropdown-placement-topRight')).toBe(true);
      component.snOpen = false;
      fixture.detectChanges();
      flush();
    }));
  });
});

@Component({
  template: `
    <sn-select
      snMode="default"
      [(ngModel)]="value"
      [snSize]="snSize"
      [snDropdownMatchSelectWidth]="snDropdownMatchSelectWidth"
      [snPlaceHolder]="snPlaceHolder"
      [snDropdownRender]="snDropdownRender"
      [snCustomTemplate]="snCustomTemplate"
      [snSuffixIcon]="snSuffixIcon"
      [snClearIcon]="snClearIcon"
      [snShowArrow]="snShowArrow"
      [snFilterOption]="snFilterOption"
      [compareWith]="compareWith"
      [snAllowClear]="snAllowClear"
      [snBorderless]="snBorderless"
      [snShowSearch]="snShowSearch"
      [snLoading]="snLoading"
      [snAutoFocus]="snAutoFocus"
      [snServerSearch]="snServerSearch"
      [snDisabled]="snDisabled"
      [snBackdrop]="snBackdrop"
      [(snOpen)]="snOpen"
      [snPlacement]="snPlacement"
      [snSelectOnTab]="snSelectOnTab"
      [snMaxMultipleCount]="snMaxMultipleCount"
      (ngModelChange)="valueChange($event)"
      (snOnSearch)="searchValueChange($event)"
      (snOpenChange)="openChange($event)"
    >
      <sn-option
        *ngFor="let o of listOfOption"
        [snValue]="o.snValue"
        [snLabel]="o.snLabel"
        [snTitle]="o.snTitle"
        [snDisabled]="o.snDisabled"
        [snHide]="o.snHide"
      ></sn-option>
      <sn-option-group *ngFor="let group of listOfGroup" [snLabel]="group.snLabel">
        <sn-option
          *ngFor="let o of group.children"
          [snValue]="o.snValue"
          [snLabel]="o.snLabel"
          [snTitle]="o.snTitle"
          [snDisabled]="o.snDisabled"
          [snHide]="o.snHide"
        ></sn-option>
      </sn-option-group>
    </sn-select>
    <ng-template #dropdownTemplate><div class="dropdown-render">dropdownRender</div></ng-template>
    <ng-template #customTemplate let-selected>selected: {{ selected.snLabel }}</ng-template>
    <ng-template #suffixIconTemplate>icon</ng-template>
  `
})
export class TestSelectTemplateDefaultComponent {
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<SnSafeAny>;
  @ViewChild('customTemplate') customTemplate!: TemplateRef<SnSafeAny>;
  @ViewChild('suffixIconTemplate') suffixIconTemplate!: TemplateRef<SnSafeAny>;
  value: SnSafeAny | null = null;
  valueChange = jasmine.createSpy('valueChange');
  openChange = jasmine.createSpy('openChange');
  searchValueChange = jasmine.createSpy('searchValueChange');
  listOfGroup: Array<{ snLabel: string | TemplateRef<SnSafeAny> | null; children: SnSelectItemInterface[] }> = [];
  listOfOption: SnSelectItemInterface[] = [];
  snSize: SnSelectSizeType = 'default';
  snDropdownMatchSelectWidth = true;
  snPlaceHolder: string | TemplateRef<SnSafeAny> | null = null;
  snDropdownRender: TemplateRef<SnSafeAny> | null = null;
  snCustomTemplate?: TemplateRef<{ $implicit: SnSelectItemInterface }>;
  snSuffixIcon: TemplateRef<SnSafeAny> | null = null;
  snClearIcon: TemplateRef<SnSafeAny> | null = null;
  snShowArrow = true;
  snMaxMultipleCount: number = Infinity;
  snFilterOption: SnFilterOptionType = (searchValue: string, item: SnSelectItemInterface): boolean => {
    if (item && item.snLabel) {
      return item.snLabel.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    } else {
      return false;
    }
  };
  compareWith: (o1: SnSafeAny, o2: SnSafeAny) => boolean = (o1: SnSafeAny, o2: SnSafeAny) => o1 === o2;
  snAllowClear = false;
  snBorderless = false;
  snShowSearch = false;
  snLoading = false;
  snAutoFocus = false;
  snServerSearch = false;
  snDisabled = false;
  snOpen = false;
  snBackdrop = false;
  snSelectOnTab = false;
  snPlacement: SnSelectPlacementType | null = 'bottomLeft';
}

@Component({
  template: `
    <sn-select
      snMode="multiple"
      [(ngModel)]="value"
      [snMenuItemSelectedIcon]="snMenuItemSelectedIcon"
      [snTokenSeparators]="snTokenSeparators"
      [snRemoveIcon]="snRemoveIcon"
      [snMaxMultipleCount]="snMaxMultipleCount"
      [compareWith]="compareWith"
      [snAutoClearSearchValue]="snAutoClearSearchValue"
      [(snOpen)]="snOpen"
      (ngModelChange)="valueChange($event)"
      (snOpenChange)="valueChange($event)"
    >
      <sn-option
        *ngFor="let o of listOfOption"
        [snValue]="o.snValue"
        [snLabel]="o.snLabel"
        [snDisabled]="o.snDisabled"
        [snHide]="o.snHide"
      ></sn-option>
    </sn-select>
    <ng-template #iconTemplate>icon</ng-template>
  `
})
export class TestSelectTemplateMultipleComponent {
  @ViewChild('iconTemplate') iconTemplate!: TemplateRef<SnSafeAny>;
  listOfOption: SnSelectItemInterface[] = [];
  value: SnSafeAny[] = [];
  snOpen = false;
  valueChange = jasmine.createSpy('valueChange');
  openChange = jasmine.createSpy('openChange');
  snMenuItemSelectedIcon: TemplateRef<SnSafeAny> | null = null;
  snRemoveIcon: TemplateRef<SnSafeAny> | null = null;
  snTokenSeparators: string[] = [];
  snMaxMultipleCount = Infinity;
  compareWith: (o1: SnSafeAny, o2: SnSafeAny) => boolean = (o1: SnSafeAny, o2: SnSafeAny) => o1 === o2;
  snAutoClearSearchValue = true;
}

@Component({
  template: `
    <sn-select
      snMode="tags"
      [(ngModel)]="value"
      [snSize]="snSize"
      [snMaxTagCount]="snMaxTagCount"
      [snTokenSeparators]="snTokenSeparators"
      [snMaxTagPlaceholder]="snMaxTagPlaceholder"
      (ngModelChange)="valueChange($event)"
    >
      <sn-option
        *ngFor="let o of listOfOption"
        [snValue]="o.snValue"
        [snLabel]="o.snLabel"
        [snDisabled]="o.snDisabled"
        [snHide]="o.snHide"
      ></sn-option>
    </sn-select>
    <ng-template #tagTemplate let-selectedList>and {{ selectedList.length }} more selected</ng-template>
  `
})
export class TestSelectTemplateTagsComponent {
  @ViewChild('tagTemplate') tagTemplate!: TemplateRef<SnSafeAny>;
  snSize: SnSelectSizeType = 'default';
  snMaxTagCount = Infinity;
  value: SnSafeAny[] = [];
  listOfOption: SnSelectItemInterface[] = [];
  valueChange = jasmine.createSpy('valueChange');
  snTokenSeparators: string[] = [];
  snMaxTagPlaceholder!: TemplateRef<{ $implicit: SnSafeAny[] }>;
}

@Component({
  template: `
    <sn-select
      snMode="default"
      [(ngModel)]="value"
      [snOptions]="listOfOption"
      [snSize]="snSize"
      [snDropdownMatchSelectWidth]="snDropdownMatchSelectWidth"
      [snPlaceHolder]="snPlaceHolder"
      [snDropdownRender]="snDropdownRender"
      [snCustomTemplate]="snCustomTemplate"
      [snSuffixIcon]="snSuffixIcon"
      [snClearIcon]="snClearIcon"
      [snShowArrow]="snShowArrow"
      [snFilterOption]="snFilterOption"
      [compareWith]="compareWith"
      [snAllowClear]="snAllowClear"
      [snBorderless]="snBorderless"
      [snShowSearch]="snShowSearch"
      [snLoading]="snLoading"
      [snAutoFocus]="snAutoFocus"
      [snServerSearch]="snServerSearch"
      [snDisabled]="snDisabled"
      [(snOpen)]="snOpen"
      (ngModelChange)="valueChange($event)"
      (snOnSearch)="searchValueChange($event)"
      (snOpenChange)="openChange($event)"
    ></sn-select>
    <ng-template #dropdownTemplate><div class="dropdown-render">dropdownRender</div></ng-template>
    <ng-template #customTemplate let-selected>selected: {{ selected.snLabel }}</ng-template>
    <ng-template #suffixIconTemplate>icon</ng-template>
  `
})
export class TestSelectReactiveDefaultComponent {
  @ViewChild('dropdownTemplate') dropdownTemplate!: TemplateRef<SnSafeAny>;
  @ViewChild('customTemplate') customTemplate!: TemplateRef<SnSafeAny>;
  @ViewChild('suffixIconTemplate') suffixIconTemplate!: TemplateRef<SnSafeAny>;
  value: SnSafeAny | null = null;
  valueChange = jasmine.createSpy('valueChange');
  openChange = jasmine.createSpy('openChange');
  searchValueChange = jasmine.createSpy('searchValueChange');
  listOfOption: SnSelectOptionInterface[] = [];
  snSize: SnSelectSizeType = 'default';
  snDropdownMatchSelectWidth = true;
  snPlaceHolder: string | TemplateRef<SnSafeAny> | null = null;
  snDropdownRender: TemplateRef<SnSafeAny> | null = null;
  snCustomTemplate?: TemplateRef<{ $implicit: SnSelectItemInterface }>;
  snSuffixIcon: TemplateRef<SnSafeAny> | null = null;
  snClearIcon: TemplateRef<SnSafeAny> | null = null;
  snShowArrow = true;
  snFilterOption: SnFilterOptionType = (searchValue: string, item: SnSelectItemInterface): boolean => {
    if (item && item.snLabel) {
      return item.snLabel.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    } else {
      return false;
    }
  };
  compareWith: (o1: SnSafeAny, o2: SnSafeAny) => boolean = (o1: SnSafeAny, o2: SnSafeAny) => o1 === o2;
  snAllowClear = false;
  snBorderless = false;
  snShowSearch = false;
  snLoading = false;
  snAutoFocus = false;
  snServerSearch = false;
  snDisabled = false;
  snOpen = false;
}

@Component({
  template: `
    <sn-select
      snMode="multiple"
      [(ngModel)]="value"
      [snOptions]="listOfOption"
      [snMenuItemSelectedIcon]="snMenuItemSelectedIcon"
      [snTokenSeparators]="snTokenSeparators"
      [snRemoveIcon]="snRemoveIcon"
      [snMaxMultipleCount]="snMaxMultipleCount"
      [compareWith]="compareWith"
      [snAutoClearSearchValue]="snAutoClearSearchValue"
      [(snOpen)]="snOpen"
      (ngModelChange)="valueChange($event)"
      (snOpenChange)="valueChange($event)"
    ></sn-select>
    <ng-template #iconTemplate>icon</ng-template>
  `
})
export class TestSelectReactiveMultipleComponent {
  @ViewChild('iconTemplate') iconTemplate!: TemplateRef<SnSafeAny>;
  listOfOption: SnSelectOptionInterface[] = [];
  value: SnSafeAny[] = [];
  snOpen = false;
  valueChange = jasmine.createSpy('valueChange');
  openChange = jasmine.createSpy('openChange');
  snMenuItemSelectedIcon: TemplateRef<SnSafeAny> | null = null;
  snRemoveIcon: TemplateRef<SnSafeAny> | null = null;
  snTokenSeparators: string[] = [];
  snMaxMultipleCount = Infinity;
  compareWith: (o1: SnSafeAny, o2: SnSafeAny) => boolean = (o1: SnSafeAny, o2: SnSafeAny) => o1 === o2;
  snAutoClearSearchValue = true;
}

@Component({
  template: `
    <sn-select
      snMode="tags"
      [(ngModel)]="value"
      [snOptions]="listOfOption"
      [snSize]="snSize"
      [snMaxTagCount]="snMaxTagCount"
      [snTokenSeparators]="snTokenSeparators"
      [snMaxTagPlaceholder]="snMaxTagPlaceholder"
      (ngModelChange)="valueChange($event)"
    ></sn-select>
    <ng-template #tagTemplate let-selectedList>and {{ selectedList.length }} more selected</ng-template>
  `
})
export class TestSelectReactiveTagsComponent {
  @ViewChild('tagTemplate') tagTemplate?: TemplateRef<SnSafeAny>;
  snSize: SnSelectSizeType = 'default';
  snMaxTagCount = Infinity;
  value: SnSafeAny[] = [];
  listOfOption: SnSelectOptionInterface[] = [];
  valueChange = jasmine.createSpy('valueChange');
  snTokenSeparators: string[] = [];
  snMaxTagPlaceholder?: TemplateRef<{ $implicit: SnSafeAny[] }>;
}

@Component({
  template: ` <sn-select [snStatus]="status"></sn-select> `
})
export class TestSelectStatusComponent {
  status: SnStatus = 'error';
}

@Component({
  template: `
    <form sn-form [formGroup]="selectForm">
      <sn-form-item>
        <sn-form-control [snHasFeedback]="feedback" [snValidateStatus]="status">
          <sn-select formControlName="selectControl" [snOptions]="[]" [snDisabled]="disabled"></sn-select>
        </sn-form-control>
      </sn-form-item>
    </form>
  `
})
export class TestSelectInFormComponent {
  selectForm = new FormGroup({
    selectControl: new FormControl(null)
  });
  status: SnFormControlStatusType = 'error';
  feedback = true;

  disabled = false;

  disable(): void {
    this.selectForm.disable();
  }

  enable(): void {
    this.selectForm.enable();
  }
}
