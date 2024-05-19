

import { FocusMonitor } from '@angular/cdk/a11y';
import { Direction, Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, ESCAPE, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedOverlayPositionChange,
  ConnectionPositionPair
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { NgIf, NgStyle } from '@angular/common';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, combineLatest, fromEvent, merge, of as observableOf } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';

import { slideMotion } from 'ngx-sedna/core/animation';
import { SnConfigKey, SnConfigService, WithConfig } from 'ngx-sedna/core/config';
import { SnFormNoStatusService, SnFormPatchModule, SnFormStatusService } from 'ngx-sedna/core/form';
import { SnNoAnimationDirective } from 'ngx-sedna/core/no-animation';
import { getPlacementName, SnOverlayModule, POSITION_MAP, POSITION_TYPE } from 'ngx-sedna/core/overlay';
import { cancelRequestAnimationFrame, reqAnimFrame } from 'ngx-sedna/core/polyfill';
import { SnDestroyService } from 'ngx-sedna/core/services';
import {
  BooleanInput,
  NgClassInterface,
  SnSafeAny,
  SnStatus,
  SnValidateStatus,
  OnChangeType,
  OnTouchedType
} from 'ngx-sedna/core/types';
import { getStatusClassNames, InputBoolean, isNotNil } from 'ngx-sedna/core/util';

import { SnOptionContainerComponent } from './option-container.component';
import { SnOptionGroupComponent } from './option-group.component';
import { SnOptionComponent } from './option.component';
import { SnSelectArrowComponent } from './select-arrow.component';
import { SnSelectClearComponent } from './select-clear.component';
import { SnSelectTopControlComponent } from './select-top-control.component';
import {
  SnFilterOptionType,
  SnSelectItemInterface,
  SnSelectModeType,
  SnSelectOptionInterface,
  SnSelectPlacementType
} from './select.types';

const defaultFilterOption: SnFilterOptionType = (searchValue: string, item: SnSelectItemInterface): boolean => {
  if (item && item.nzLabel) {
    return item.nzLabel.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  } else {
    return false;
  }
};

const NZ_CONFIG_MODULE_NAME: SnConfigKey = 'select';

export type NzSelectSizeType = 'large' | 'default' | 'small';

@Component({
  selector: 'nz-select',
  exportAs: 'nzSelect',
  preserveWhitespaces: false,
  providers: [
    SnDestroyService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SnSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [slideMotion],
  template: `
    <nz-select-top-control
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [nzId]="nzId"
      [open]="nzOpen"
      [disabled]="nzDisabled"
      [mode]="nzMode"
      [@.disabled]="!!noAnimation?.nzNoAnimation"
      [nzNoAnimation]="noAnimation?.nzNoAnimation"
      [maxTagPlaceholder]="nzMaxTagPlaceholder"
      [removeIcon]="nzRemoveIcon"
      [placeHolder]="nzPlaceHolder"
      [maxTagCount]="nzMaxTagCount"
      [customTemplate]="nzCustomTemplate"
      [tokenSeparators]="nzTokenSeparators"
      [showSearch]="nzShowSearch"
      [autofocus]="nzAutoFocus"
      [listOfTopItem]="listOfTopItem"
      (inputValueChange)="onInputValueChange($event)"
      (tokenize)="onTokenSeparate($event)"
      (deleteItem)="onItemDelete($event)"
      (keydown)="onKeyDown($event)"
    ></nz-select-top-control>
    <nz-select-arrow
      *ngIf="nzShowArrow || (hasFeedback && !!status) || isMaxTagCountSet"
      [showArrow]="nzShowArrow"
      [loading]="nzLoading"
      [search]="nzOpen && nzShowSearch"
      [suffixIcon]="nzSuffixIcon"
      [feedbackIcon]="feedbackIconTpl"
      [nzMaxMultipleCount]="nzMaxMultipleCount"
      [listOfValue]="listOfValue"
      [isMaxTagCountSet]="isMaxTagCountSet"
    >
      <ng-template #feedbackIconTpl>
        <nz-form-item-feedback-icon *ngIf="hasFeedback && !!status" [status]="status"></nz-form-item-feedback-icon>
      </ng-template>
    </nz-select-arrow>

    <nz-select-clear
      *ngIf="nzAllowClear && !nzDisabled && listOfValue.length"
      [clearIcon]="nzClearIcon"
      (clear)="onClearSelection()"
    ></nz-select-clear>
    <ng-template
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="nzBackdrop"
      [cdkConnectedOverlayMinWidth]="$any(nzDropdownMatchSelectWidth ? null : triggerWidth)"
      [cdkConnectedOverlayWidth]="$any(nzDropdownMatchSelectWidth ? triggerWidth : null)"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-select-dropdown'"
      [cdkConnectedOverlayPanelClass]="nzDropdownClassName!"
      [cdkConnectedOverlayOpen]="nzOpen"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="setOpenState(false)"
      (positionChange)="onPositionChange($event)"
    >
      <nz-option-container
        [ngStyle]="nzDropdownStyle"
        [itemSize]="nzOptionHeightPx"
        [maxItemLength]="nzOptionOverflowSize"
        [matchWidth]="nzDropdownMatchSelectWidth"
        [class.ant-select-dropdown-placement-bottomLeft]="dropDownPosition === 'bottomLeft'"
        [class.ant-select-dropdown-placement-topLeft]="dropDownPosition === 'topLeft'"
        [class.ant-select-dropdown-placement-bottomRight]="dropDownPosition === 'bottomRight'"
        [class.ant-select-dropdown-placement-topRight]="dropDownPosition === 'topRight'"
        [@slideMotion]="'enter'"
        [@.disabled]="!!noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [listOfContainerItem]="listOfContainerItem"
        [menuItemSelectedIcon]="nzMenuItemSelectedIcon"
        [notFoundContent]="nzNotFoundContent"
        [activatedValue]="activatedValue"
        [listOfSelectedValue]="listOfValue"
        [dropdownRender]="nzDropdownRender"
        [compareWith]="compareWith"
        [mode]="nzMode"
        [isMaxLimitReached]="isMaxLimitReached"
        (keydown)="onKeyDown($event)"
        (itemClick)="onItemClick($event)"
        (scrollToBottom)="nzScrollToBottom.emit()"
      ></nz-option-container>
    </ng-template>
  `,
  host: {
    class: 'ant-select',
    '[class.ant-select-in-form-item]': '!!nzFormStatusService',
    '[class.ant-select-lg]': 'nzSize === "large"',
    '[class.ant-select-sm]': 'nzSize === "small"',
    '[class.ant-select-show-arrow]': `nzShowArrow`,
    '[class.ant-select-disabled]': 'nzDisabled',
    '[class.ant-select-show-search]': `(nzShowSearch || nzMode !== 'default') && !nzDisabled`,
    '[class.ant-select-allow-clear]': 'nzAllowClear',
    '[class.ant-select-borderless]': 'nzBorderless',
    '[class.ant-select-open]': 'nzOpen',
    '[class.ant-select-focused]': 'nzOpen || focused',
    '[class.ant-select-single]': `nzMode === 'default'`,
    '[class.ant-select-multiple]': `nzMode !== 'default'`,
    '[class.ant-select-rtl]': `dir === 'rtl'`
  },
  imports: [
    SnSelectTopControlComponent,
    CdkOverlayOrigin,
    SnNoAnimationDirective,
    SnSelectArrowComponent,
    NgIf,
    SnFormPatchModule,
    SnSelectClearComponent,
    CdkConnectedOverlay,
    SnOverlayModule,
    SnOptionContainerComponent,
    NgStyle
  ],
  standalone: true
})
export class SnSelectComponent implements ControlValueAccessor, OnInit, AfterContentInit, OnChanges, OnDestroy {
  readonly _nzModuleName: SnConfigKey = NZ_CONFIG_MODULE_NAME;

  static ngAcceptInputType_nzAllowClear: BooleanInput;
  static ngAcceptInputType_nzBorderless: BooleanInput;
  static ngAcceptInputType_nzShowSearch: BooleanInput;
  static ngAcceptInputType_nzLoading: BooleanInput;
  static ngAcceptInputType_nzAutoFocus: BooleanInput;
  static ngAcceptInputType_nzAutoClearSearchValue: BooleanInput;
  static ngAcceptInputType_nzServerSearch: BooleanInput;
  static ngAcceptInputType_nzDisabled: BooleanInput;
  static ngAcceptInputType_nzOpen: BooleanInput;

  @Input() nzId: string | null = null;
  @Input() nzSize: NzSelectSizeType = 'default';
  @Input() nzStatus: SnStatus = '';
  @Input() @WithConfig<number>() nzOptionHeightPx = 32;
  @Input() nzOptionOverflowSize = 8;
  @Input() nzDropdownClassName: string[] | string | null = null;
  @Input() nzDropdownMatchSelectWidth = true;
  @Input() nzDropdownStyle: { [key: string]: string } | null = null;
  @Input() nzNotFoundContent: string | TemplateRef<SnSafeAny> | undefined = undefined;
  @Input() nzPlaceHolder: string | TemplateRef<SnSafeAny> | null = null;
  @Input() nzPlacement: SnSelectPlacementType | null = null;
  @Input() nzMaxTagCount = Infinity;
  @Input() nzDropdownRender: TemplateRef<SnSafeAny> | null = null;
  @Input() nzCustomTemplate: TemplateRef<{ $implicit: SnSelectItemInterface }> | null = null;
  @Input()
  @WithConfig<TemplateRef<SnSafeAny> | string | null>()
  nzSuffixIcon: TemplateRef<SnSafeAny> | string | null = null;
  @Input() nzClearIcon: TemplateRef<SnSafeAny> | null = null;
  @Input() nzRemoveIcon: TemplateRef<SnSafeAny> | null = null;
  @Input() nzMenuItemSelectedIcon: TemplateRef<SnSafeAny> | null = null;
  @Input() nzTokenSeparators: string[] = [];
  @Input() nzMaxTagPlaceholder: TemplateRef<{ $implicit: SnSafeAny[] }> | null = null;
  @Input() nzMaxMultipleCount = Infinity;
  @Input() nzMode: SnSelectModeType = 'default';
  @Input() nzFilterOption: SnFilterOptionType = defaultFilterOption;
  @Input() compareWith: (o1: SnSafeAny, o2: SnSafeAny) => boolean = (o1: SnSafeAny, o2: SnSafeAny) => o1 === o2;
  @Input() @InputBoolean() nzAllowClear = false;
  @Input() @WithConfig<boolean>() @InputBoolean() nzBorderless = false;
  @Input() @InputBoolean() nzShowSearch = false;
  @Input() @InputBoolean() nzLoading = false;
  @Input() @InputBoolean() nzAutoFocus = false;
  @Input() @InputBoolean() nzAutoClearSearchValue = true;
  @Input() @InputBoolean() nzServerSearch = false;
  @Input() @InputBoolean() nzDisabled = false;
  @Input() @InputBoolean() nzOpen = false;
  @Input() @InputBoolean() nzSelectOnTab = false;
  @Input() @WithConfig<boolean>() @InputBoolean() nzBackdrop = false;
  @Input() nzOptions: SnSelectOptionInterface[] = [];

  @Input()
  set nzShowArrow(value: boolean) {
    this._nzShowArrow = value;
  }
  get nzShowArrow(): boolean {
    return this._nzShowArrow === undefined ? this.nzMode === 'default' : this._nzShowArrow;
  }

  get isMaxTagCountSet(): boolean {
    return this.nzMaxMultipleCount !== Infinity;
  }

  @Output() readonly nzOnSearch = new EventEmitter<string>();
  @Output() readonly nzScrollToBottom = new EventEmitter<void>();
  @Output() readonly nzOpenChange = new EventEmitter<boolean>();
  @Output() readonly nzBlur = new EventEmitter<void>();
  @Output() readonly nzFocus = new EventEmitter<void>();
  @ViewChild(CdkOverlayOrigin, { static: true, read: ElementRef }) originElement!: ElementRef;
  @ViewChild(CdkConnectedOverlay, { static: true }) cdkConnectedOverlay!: CdkConnectedOverlay;
  @ViewChild(SnSelectTopControlComponent, { static: true }) nzSelectTopControlComponent!: SnSelectTopControlComponent;
  @ContentChildren(SnOptionComponent, { descendants: true }) listOfNzOptionComponent!: QueryList<SnOptionComponent>;
  @ContentChildren(SnOptionGroupComponent, { descendants: true })
  listOfNzOptionGroupComponent!: QueryList<SnOptionGroupComponent>;
  @ViewChild(SnOptionGroupComponent, { static: true, read: ElementRef }) nzOptionGroupComponentElement!: ElementRef;
  @ViewChild(SnSelectTopControlComponent, { static: true, read: ElementRef })
  nzSelectTopControlComponentElement!: ElementRef;
  private listOfValue$ = new BehaviorSubject<SnSafeAny[]>([]);
  private listOfTemplateItem$ = new BehaviorSubject<SnSelectItemInterface[]>([]);
  private listOfTagAndTemplateItem: SnSelectItemInterface[] = [];
  private searchValue: string = '';
  private isReactiveDriven = false;
  private value: SnSafeAny | SnSafeAny[];
  private _nzShowArrow: boolean | undefined;
  private requestId: number = -1;
  private isNzDisableFirstChange: boolean = true;
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  dropDownPosition: SnSelectPlacementType = 'bottomLeft';
  triggerWidth: number | null = null;
  listOfContainerItem: SnSelectItemInterface[] = [];
  listOfTopItem: SnSelectItemInterface[] = [];
  activatedValue: SnSafeAny | null = null;
  listOfValue: SnSafeAny[] = [];
  focused = false;
  dir: Direction = 'ltr';
  positions: ConnectionPositionPair[] = [];
  isMaxLimitReached = false;

  // status
  prefixCls: string = 'ant-select';
  statusCls: NgClassInterface = {};
  status: SnValidateStatus = '';
  hasFeedback: boolean = false;

  generateTagItem(value: string): SnSelectItemInterface {
    return {
      nzValue: value,
      nzLabel: value,
      type: 'item'
    };
  }

  onItemClick(value: SnSafeAny): void {
    this.activatedValue = value;
    if (this.nzMode === 'default') {
      if (this.listOfValue.length === 0 || !this.compareWith(this.listOfValue[0], value)) {
        this.updateListOfValue([value]);
      }
      this.setOpenState(false);
    } else {
      const targetIndex = this.listOfValue.findIndex(o => this.compareWith(o, value));
      if (targetIndex !== -1) {
        const listOfValueAfterRemoved = this.listOfValue.filter((_, i) => i !== targetIndex);
        this.updateListOfValue(listOfValueAfterRemoved);
      } else if (this.listOfValue.length < this.nzMaxMultipleCount) {
        const listOfValueAfterAdded = [...this.listOfValue, value];
        this.updateListOfValue(listOfValueAfterAdded);
      }
      this.focus();
      if (this.nzAutoClearSearchValue) {
        this.clearInput();
      }
    }
  }

  onItemDelete(item: SnSelectItemInterface): void {
    const listOfSelectedValue = this.listOfValue.filter(v => !this.compareWith(v, item.nzValue));
    this.updateListOfValue(listOfSelectedValue);
    this.clearInput();
  }

  updateListOfContainerItem(): void {
    let listOfContainerItem = this.listOfTagAndTemplateItem
      .filter(item => !item.nzHide)
      .filter(item => {
        if (!this.nzServerSearch && this.searchValue) {
          return this.nzFilterOption(this.searchValue, item);
        } else {
          return true;
        }
      });
    if (this.nzMode === 'tags' && this.searchValue) {
      const matchedItem = this.listOfTagAndTemplateItem.find(item => item.nzLabel === this.searchValue);
      if (!matchedItem) {
        const tagItem = this.generateTagItem(this.searchValue);
        listOfContainerItem = [tagItem, ...listOfContainerItem];
        this.activatedValue = tagItem.nzValue;
      } else {
        this.activatedValue = matchedItem.nzValue;
      }
    }
    const activatedItem =
      listOfContainerItem.find(item => item.nzLabel === this.searchValue) ||
      listOfContainerItem.find(item => this.compareWith(item.nzValue, this.activatedValue)) ||
      listOfContainerItem.find(item => this.compareWith(item.nzValue, this.listOfValue[0])) ||
      listOfContainerItem[0];
    this.activatedValue = (activatedItem && activatedItem.nzValue) || null;
    let listOfGroupLabel: Array<string | number | TemplateRef<SnSafeAny> | null> = [];
    if (this.isReactiveDriven) {
      listOfGroupLabel = [...new Set(this.nzOptions.filter(o => o.groupLabel).map(o => o.groupLabel!))];
    } else {
      if (this.listOfNzOptionGroupComponent) {
        listOfGroupLabel = this.listOfNzOptionGroupComponent.map(o => o.nzLabel);
      }
    }
    /** insert group item **/
    listOfGroupLabel.forEach(label => {
      const index = listOfContainerItem.findIndex(item => label === item.groupLabel);
      if (index > -1) {
        const groupItem = { groupLabel: label, type: 'group', key: label } as SnSelectItemInterface;
        listOfContainerItem.splice(index, 0, groupItem);
      }
    });
    this.listOfContainerItem = [...listOfContainerItem];
    this.updateCdkConnectedOverlayPositions();
  }

  clearInput(): void {
    this.nzSelectTopControlComponent.clearInputValue();
  }

  updateListOfValue(listOfValue: SnSafeAny[]): void {
    const covertListToModel = (list: SnSafeAny[], mode: SnSelectModeType): SnSafeAny[] | SnSafeAny => {
      if (mode === 'default') {
        if (list.length > 0) {
          return list[0];
        } else {
          return null;
        }
      } else {
        return list;
      }
    };
    const model = covertListToModel(listOfValue, this.nzMode);
    if (this.value !== model) {
      this.listOfValue = listOfValue;
      this.listOfValue$.next(listOfValue);
      this.value = model;
      this.onChange(this.value);
    }

    this.isMaxLimitReached =
      this.nzMaxMultipleCount !== Infinity && this.listOfValue.length === this.nzMaxMultipleCount;
  }

  onTokenSeparate(listOfLabel: string[]): void {
    const listOfMatchedValue = this.listOfTagAndTemplateItem
      .filter(item => listOfLabel.findIndex(label => label === item.nzLabel) !== -1)
      .map(item => item.nzValue)
      .filter(item => this.listOfValue.findIndex(v => this.compareWith(v, item)) === -1);
    if (this.nzMode === 'multiple') {
      this.updateListOfValue([...this.listOfValue, ...listOfMatchedValue]);
    } else if (this.nzMode === 'tags') {
      const listOfUnMatchedLabel = listOfLabel.filter(
        label => this.listOfTagAndTemplateItem.findIndex(item => item.nzLabel === label) === -1
      );
      this.updateListOfValue([...this.listOfValue, ...listOfMatchedValue, ...listOfUnMatchedLabel]);
    }
    this.clearInput();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.nzDisabled) {
      return;
    }
    const listOfFilteredOptionNotDisabled = this.listOfContainerItem
      .filter(item => item.type === 'item')
      .filter(item => !item.nzDisabled);
    const activatedIndex = listOfFilteredOptionNotDisabled.findIndex(item =>
      this.compareWith(item.nzValue, this.activatedValue)
    );
    switch (e.keyCode) {
      case UP_ARROW:
        e.preventDefault();
        if (this.nzOpen && listOfFilteredOptionNotDisabled.length > 0) {
          const preIndex = activatedIndex > 0 ? activatedIndex - 1 : listOfFilteredOptionNotDisabled.length - 1;
          this.activatedValue = listOfFilteredOptionNotDisabled[preIndex].nzValue;
        }
        break;
      case DOWN_ARROW:
        e.preventDefault();
        if (this.nzOpen && listOfFilteredOptionNotDisabled.length > 0) {
          const nextIndex = activatedIndex < listOfFilteredOptionNotDisabled.length - 1 ? activatedIndex + 1 : 0;
          this.activatedValue = listOfFilteredOptionNotDisabled[nextIndex].nzValue;
        } else {
          this.setOpenState(true);
        }
        break;
      case ENTER:
        e.preventDefault();
        if (this.nzOpen) {
          if (isNotNil(this.activatedValue) && activatedIndex !== -1) {
            this.onItemClick(this.activatedValue);
          }
        } else {
          this.setOpenState(true);
        }
        break;
      case SPACE:
        if (!this.nzOpen) {
          this.setOpenState(true);
          e.preventDefault();
        }
        break;
      case TAB:
        if (this.nzSelectOnTab) {
          if (this.nzOpen) {
            e.preventDefault();
            if (isNotNil(this.activatedValue)) {
              this.onItemClick(this.activatedValue);
            }
          }
        } else {
          this.setOpenState(false);
        }
        break;
      case ESCAPE:
        /**
         * Skip the ESCAPE processing, it will be handled in {@link onOverlayKeyDown}.
         */
        break;
      default:
        if (!this.nzOpen) {
          this.setOpenState(true);
        }
    }
  }

  setOpenState(value: boolean): void {
    if (this.nzOpen !== value) {
      this.nzOpen = value;
      this.nzOpenChange.emit(value);
      this.onOpenChange();
      this.cdr.markForCheck();
    }
  }

  onOpenChange(): void {
    this.updateCdkConnectedOverlayStatus();
    if (this.nzAutoClearSearchValue) {
      this.clearInput();
    }
  }

  onInputValueChange(value: string): void {
    this.searchValue = value;
    this.updateListOfContainerItem();
    this.nzOnSearch.emit(value);
    this.updateCdkConnectedOverlayPositions();
  }

  onClearSelection(): void {
    this.updateListOfValue([]);
  }

  onClickOutside(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as HTMLElement)) {
      this.setOpenState(false);
    }
  }

  focus(): void {
    this.nzSelectTopControlComponent.focus();
  }

  blur(): void {
    this.nzSelectTopControlComponent.blur();
  }

  onPositionChange(position: ConnectedOverlayPositionChange): void {
    const placement = getPlacementName(position);
    this.dropDownPosition = placement as SnSelectPlacementType;
  }

  updateCdkConnectedOverlayStatus(): void {
    if (this.platform.isBrowser && this.originElement.nativeElement) {
      const triggerWidth = this.triggerWidth;
      cancelRequestAnimationFrame(this.requestId);
      this.requestId = reqAnimFrame(() => {
        // Blink triggers style and layout pipelines anytime the `getBoundingClientRect()` is called, which may cause a
        // frame drop. That's why it's scheduled through the `requestAnimationFrame` to unload the composite thread.
        this.triggerWidth = this.originElement.nativeElement.getBoundingClientRect().width;
        if (triggerWidth !== this.triggerWidth) {
          // The `requestAnimationFrame` will trigger change detection, but we're inside an `OnPush` component which won't have
          // the `ChecksEnabled` state. Calling `markForCheck()` will allow Angular to run the change detection from the root component
          // down to the `nz-select`. But we'll trigger only local change detection if the `triggerWidth` has been changed.
          this.cdr.detectChanges();
        }
      });
    }
  }

  updateCdkConnectedOverlayPositions(): void {
    reqAnimFrame(() => {
      this.cdkConnectedOverlay?.overlayRef?.updatePosition();
    });
  }

  constructor(
    private ngZone: NgZone,
    private destroy$: SnDestroyService,
    public nzConfigService: SnConfigService,
    private cdr: ChangeDetectorRef,
    private host: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private platform: Platform,
    private focusMonitor: FocusMonitor,
    @Optional() private directionality: Directionality,
    @Host() @Optional() public noAnimation?: SnNoAnimationDirective,
    @Optional() public nzFormStatusService?: SnFormStatusService,
    @Optional() private nzFormNoStatusService?: SnFormNoStatusService
  ) {}

  writeValue(modelValue: SnSafeAny | SnSafeAny[]): void {
    /** https://github.com/angular/angular/issues/14988 **/
    if (this.value !== modelValue) {
      this.value = modelValue;
      const covertModelToList = (model: SnSafeAny[] | SnSafeAny, mode: SnSelectModeType): SnSafeAny[] => {
        if (model === null || model === undefined) {
          return [];
        } else if (mode === 'default') {
          return [model];
        } else {
          return model;
        }
      };
      const listOfValue = covertModelToList(modelValue, this.nzMode);
      this.listOfValue = listOfValue;
      this.listOfValue$.next(listOfValue);
      this.cdr.markForCheck();
    }
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.nzDisabled = (this.isNzDisableFirstChange && this.nzDisabled) || disabled;
    this.isNzDisableFirstChange = false;
    if (this.nzDisabled) {
      this.setOpenState(false);
    }
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { nzOpen, nzDisabled, nzOptions, nzStatus, nzPlacement } = changes;
    if (nzOpen) {
      this.onOpenChange();
    }
    if (nzDisabled && this.nzDisabled) {
      this.setOpenState(false);
    }
    if (nzOptions) {
      this.isReactiveDriven = true;
      const listOfOptions = this.nzOptions || [];
      const listOfTransformedItem = listOfOptions.map(item => {
        return {
          template: item.label instanceof TemplateRef ? item.label : null,
          nzTitle: this.getTitle(item.title, item.label),
          nzLabel: typeof item.label === 'string' || typeof item.label === 'number' ? item.label : null,
          nzValue: item.value,
          nzDisabled: item.disabled || false,
          nzHide: item.hide || false,
          nzCustomContent: item.label instanceof TemplateRef,
          groupLabel: item.groupLabel || null,
          type: 'item',
          key: item.key === undefined ? item.value : item.key
        };
      });
      this.listOfTemplateItem$.next(listOfTransformedItem);
    }
    if (nzStatus) {
      this.setStatusStyles(this.nzStatus, this.hasFeedback);
    }
    if (nzPlacement) {
      const { currentValue } = nzPlacement;
      this.dropDownPosition = currentValue as SnSelectPlacementType;
      const listOfPlacement = ['bottomLeft', 'topLeft', 'bottomRight', 'topRight'];
      if (currentValue && listOfPlacement.includes(currentValue)) {
        this.positions = [POSITION_MAP[currentValue as POSITION_TYPE]];
      } else {
        this.positions = listOfPlacement.map(e => POSITION_MAP[e as POSITION_TYPE]);
      }
    }
  }

  ngOnInit(): void {
    this.nzFormStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => {
          return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
        }),
        withLatestFrom(this.nzFormNoStatusService ? this.nzFormNoStatusService.noFormStatus : observableOf(false)),
        map(([{ status, hasFeedback }, noStatus]) => ({ status: noStatus ? '' : status, hasFeedback })),
        takeUntil(this.destroy$)
      )
      .subscribe(({ status, hasFeedback }) => {
        this.setStatusStyles(status, hasFeedback);
      });

    this.focusMonitor
      .monitor(this.host, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe(focusOrigin => {
        if (!focusOrigin) {
          this.focused = false;
          this.cdr.markForCheck();
          this.nzBlur.emit();
          Promise.resolve().then(() => {
            this.onTouched();
          });
        } else {
          this.focused = true;
          this.cdr.markForCheck();
          this.nzFocus.emit();
        }
      });
    combineLatest([this.listOfValue$, this.listOfTemplateItem$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([listOfSelectedValue, listOfTemplateItem]) => {
        const listOfTagItem = listOfSelectedValue
          .filter(() => this.nzMode === 'tags')
          .filter(value => listOfTemplateItem.findIndex(o => this.compareWith(o.nzValue, value)) === -1)
          .map(
            value => this.listOfTopItem.find(o => this.compareWith(o.nzValue, value)) || this.generateTagItem(value)
          );
        this.listOfTagAndTemplateItem = [...listOfTemplateItem, ...listOfTagItem];
        this.listOfTopItem = this.listOfValue
          .map(
            v =>
              [...this.listOfTagAndTemplateItem, ...this.listOfTopItem].find(item => this.compareWith(v, item.nzValue))!
          )
          .filter(item => !!item);
        this.updateListOfContainerItem();
      });

    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.nzConfigService
      .getConfigChangeEventForComponent('select')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cdr.markForCheck();
      });

    this.dir = this.directionality.value;

    this.ngZone.runOutsideAngular(() =>
      fromEvent(this.host.nativeElement, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          if ((this.nzOpen && this.nzShowSearch) || this.nzDisabled) {
            return;
          }

          this.ngZone.run(() => this.setOpenState(!this.nzOpen));
        })
    );

    // Caretaker note: we could've added this listener within the template `(overlayKeydown)="..."`,
    // but with this approach, it'll run change detection on each keyboard click, and also it'll run
    // `markForCheck()` internally, which means the whole component tree (starting from the root and
    // going down to the select component) will be re-checked and updated (if needed).
    // This is safe to do that manually since `setOpenState()` calls `markForCheck()` if needed.
    this.cdkConnectedOverlay.overlayKeydown.pipe(takeUntil(this.destroy$)).subscribe(event => {
      if (event.keyCode === ESCAPE) {
        this.setOpenState(false);
      }
    });
  }

  ngAfterContentInit(): void {
    if (!this.isReactiveDriven) {
      merge(this.listOfNzOptionGroupComponent.changes, this.listOfNzOptionComponent.changes)
        .pipe(
          startWith(true),
          switchMap(() =>
            merge(
              ...[
                this.listOfNzOptionComponent.changes,
                this.listOfNzOptionGroupComponent.changes,
                ...this.listOfNzOptionComponent.map(option => option.changes),
                ...this.listOfNzOptionGroupComponent.map(option => option.changes)
              ]
            ).pipe(startWith(true))
          ),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          const listOfOptionInterface = this.listOfNzOptionComponent.toArray().map(item => {
            const { template, nzLabel, nzValue, nzKey, nzDisabled, nzHide, nzCustomContent, groupLabel } = item;
            return {
              template,
              nzLabel,
              nzValue,
              nzDisabled,
              nzHide,
              nzCustomContent,
              groupLabel,
              nzTitle: this.getTitle(item.nzTitle, item.nzLabel),
              type: 'item',
              key: nzKey === undefined ? nzValue : nzKey
            };
          });
          this.listOfTemplateItem$.next(listOfOptionInterface);
          this.cdr.markForCheck();
        });
    }
  }

  ngOnDestroy(): void {
    cancelRequestAnimationFrame(this.requestId);
    this.focusMonitor.stopMonitoring(this.host);
  }

  private setStatusStyles(status: SnValidateStatus, hasFeedback: boolean): void {
    this.status = status;
    this.hasFeedback = hasFeedback;
    this.cdr.markForCheck();
    // render status if nzStatus is set
    this.statusCls = getStatusClassNames(this.prefixCls, status, hasFeedback);
    Object.keys(this.statusCls).forEach(status => {
      if (this.statusCls[status]) {
        this.renderer.addClass(this.host.nativeElement, status);
      } else {
        this.renderer.removeClass(this.host.nativeElement, status);
      }
    });
  }

  private getTitle(title: SnSelectOptionInterface['title'], label: SnSelectOptionInterface['label']): string {
    let rawTitle: string = undefined!;
    if (title === undefined) {
      if (typeof label === 'string' || typeof label === 'number') {
        rawTitle = label.toString();
      }
    } else if (typeof title === 'string' || typeof title === 'number') {
      rawTitle = title.toString();
    }

    return rawTitle;
  }
}
