

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
  if (item && item.snLabel) {
    return item.snLabel.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
  } else {
    return false;
  }
};

const SN_CONFIG_MODULE_NAME: SnConfigKey = 'select';

export type SnSelectSizeType = 'large' | 'default' | 'small';

@Component({
  selector: 'sn-select',
  exportAs: 'snSelect',
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
  styleUrls: ['./scss/index.scss'],
  template: `
    <sn-select-top-control
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [snId]="snId"
      [open]="snOpen"
      [disabled]="snDisabled"
      [mode]="snMode"
      [@.disabled]="!!noAnimation?.snNoAnimation"
      [snNoAnimation]="noAnimation?.snNoAnimation"
      [maxTagPlaceholder]="snMaxTagPlaceholder"
      [removeIcon]="snRemoveIcon"
      [placeHolder]="snPlaceHolder"
      [maxTagCount]="snMaxTagCount"
      [customTemplate]="snCustomTemplate"
      [tokenSeparators]="snTokenSeparators"
      [showSearch]="snShowSearch"
      [autofocus]="snAutoFocus"
      [listOfTopItem]="listOfTopItem"
      (inputValueChange)="onInputValueChange($event)"
      (tokenize)="onTokenSeparate($event)"
      (deleteItem)="onItemDelete($event)"
      (keydown)="onKeyDown($event)"
    ></sn-select-top-control>
    <sn-select-arrow
      *ngIf="snShowArrow || (hasFeedback && !!status) || isMaxTagCountSet"
      [showArrow]="snShowArrow"
      [loading]="snLoading"
      [search]="snOpen && snShowSearch"
      [suffixIcon]="snSuffixIcon"
      [feedbackIcon]="feedbackIconTpl"
      [snMaxMultipleCount]="snMaxMultipleCount"
      [listOfValue]="listOfValue"
      [isMaxTagCountSet]="isMaxTagCountSet"
    >
      <ng-template #feedbackIconTpl>
        <sn-form-item-feedback-icon *ngIf="hasFeedback && !!status" [status]="status"></sn-form-item-feedback-icon>
      </ng-template>
    </sn-select-arrow>

    <sn-select-clear
      *ngIf="snAllowClear && !snDisabled && listOfValue.length"
      [clearIcon]="snClearIcon"
      (clear)="onClearSelection()"
    ></sn-select-clear>
    <ng-template
      cdkConnectedOverlay
      snConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="snBackdrop"
      [cdkConnectedOverlayMinWidth]="$any(snDropdownMatchSelectWidth ? null : triggerWidth)"
      [cdkConnectedOverlayWidth]="$any(snDropdownMatchSelectWidth ? triggerWidth : null)"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-select-dropdown'"
      [cdkConnectedOverlayPanelClass]="snDropdownClassName!"
      [cdkConnectedOverlayOpen]="snOpen"
      [cdkConnectedOverlayPositions]="positions"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="setOpenState(false)"
      (positionChange)="onPositionChange($event)"
    >
      <sn-option-container
        [ngStyle]="snDropdownStyle"
        [itemSize]="snOptionHeightPx"
        [maxItemLength]="snOptionOverflowSize"
        [matchWidth]="snDropdownMatchSelectWidth"
        [class.ant-select-dropdown-placement-bottomLeft]="dropDownPosition === 'bottomLeft'"
        [class.ant-select-dropdown-placement-topLeft]="dropDownPosition === 'topLeft'"
        [class.ant-select-dropdown-placement-bottomRight]="dropDownPosition === 'bottomRight'"
        [class.ant-select-dropdown-placement-topRight]="dropDownPosition === 'topRight'"
        [@slideMotion]="'enter'"
        [@.disabled]="!!noAnimation?.snNoAnimation"
        [snNoAnimation]="noAnimation?.snNoAnimation"
        [listOfContainerItem]="listOfContainerItem"
        [menuItemSelectedIcon]="snMenuItemSelectedIcon"
        [notFoundContent]="snNotFoundContent"
        [activatedValue]="activatedValue"
        [listOfSelectedValue]="listOfValue"
        [dropdownRender]="snDropdownRender"
        [compareWith]="compareWith"
        [mode]="snMode"
        [isMaxLimitReached]="isMaxLimitReached"
        (keydown)="onKeyDown($event)"
        (itemClick)="onItemClick($event)"
        (scrollToBottom)="snScrollToBottom.emit()"
      ></sn-option-container>
    </ng-template>
  `,
  host: {
    class: 'ant-select',
    '[class.ant-select-in-form-item]': '!!snFormStatusService',
    '[class.ant-select-lg]': 'snSize === "large"',
    '[class.ant-select-sm]': 'snSize === "small"',
    '[class.ant-select-show-arrow]': `snShowArrow`,
    '[class.ant-select-disabled]': 'snDisabled',
    '[class.ant-select-show-search]': `(snShowSearch || snMode !== 'default') && !snDisabled`,
    '[class.ant-select-allow-clear]': 'snAllowClear',
    '[class.ant-select-borderless]': 'snBorderless',
    '[class.ant-select-open]': 'snOpen',
    '[class.ant-select-focused]': 'snOpen || focused',
    '[class.ant-select-single]': `snMode === 'default'`,
    '[class.ant-select-multiple]': `snMode !== 'default'`,
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
  readonly _snModuleName: SnConfigKey = SN_CONFIG_MODULE_NAME;

  static ngAcceptInputType_snAllowClear: BooleanInput;
  static ngAcceptInputType_snBorderless: BooleanInput;
  static ngAcceptInputType_snShowSearch: BooleanInput;
  static ngAcceptInputType_snLoading: BooleanInput;
  static ngAcceptInputType_snAutoFocus: BooleanInput;
  static ngAcceptInputType_snAutoClearSearchValue: BooleanInput;
  static ngAcceptInputType_snServerSearch: BooleanInput;
  static ngAcceptInputType_snDisabled: BooleanInput;
  static ngAcceptInputType_snOpen: BooleanInput;

  @Input() snId: string | null = null;
  @Input() snSize: SnSelectSizeType = 'default';
  @Input() snStatus: SnStatus = '';
  @Input() @WithConfig<number>() snOptionHeightPx = 32;
  @Input() snOptionOverflowSize = 8;
  @Input() snDropdownClassName: string[] | string | null = null;
  @Input() snDropdownMatchSelectWidth = true;
  @Input() snDropdownStyle: { [key: string]: string } | null = null;
  @Input() snNotFoundContent: string | TemplateRef<SnSafeAny> | undefined = undefined;
  @Input() snPlaceHolder: string | TemplateRef<SnSafeAny> | null = null;
  @Input() snPlacement: SnSelectPlacementType | null = null;
  @Input() snMaxTagCount = Infinity;
  @Input() snDropdownRender: TemplateRef<SnSafeAny> | null = null;
  @Input() snCustomTemplate: TemplateRef<{ $implicit: SnSelectItemInterface }> | null = null;
  @Input()
  @WithConfig<TemplateRef<SnSafeAny> | string | null>()
  snSuffixIcon: TemplateRef<SnSafeAny> | string | null = null;
  @Input() snClearIcon: TemplateRef<SnSafeAny> | null = null;
  @Input() snRemoveIcon: TemplateRef<SnSafeAny> | null = null;
  @Input() snMenuItemSelectedIcon: TemplateRef<SnSafeAny> | null = null;
  @Input() snTokenSeparators: string[] = [];
  @Input() snMaxTagPlaceholder: TemplateRef<{ $implicit: SnSafeAny[] }> | null = null;
  @Input() snMaxMultipleCount = Infinity;
  @Input() snMode: SnSelectModeType = 'default';
  @Input() snFilterOption: SnFilterOptionType = defaultFilterOption;
  @Input() compareWith: (o1: SnSafeAny, o2: SnSafeAny) => boolean = (o1: SnSafeAny, o2: SnSafeAny) => o1 === o2;
  @Input() @InputBoolean() snAllowClear = false;
  @Input() @WithConfig<boolean>() @InputBoolean() snBorderless = false;
  @Input() @InputBoolean() snShowSearch = false;
  @Input() @InputBoolean() snLoading = false;
  @Input() @InputBoolean() snAutoFocus = false;
  @Input() @InputBoolean() snAutoClearSearchValue = true;
  @Input() @InputBoolean() snServerSearch = false;
  @Input() @InputBoolean() snDisabled = false;
  @Input() @InputBoolean() snOpen = false;
  @Input() @InputBoolean() snSelectOnTab = false;
  @Input() @WithConfig<boolean>() @InputBoolean() snBackdrop = false;
  @Input() snOptions: SnSelectOptionInterface[] = [];

  @Input()
  set snShowArrow(value: boolean) {
    this._snShowArrow = value;
  }
  get snShowArrow(): boolean {
    return this._snShowArrow === undefined ? this.snMode === 'default' : this._snShowArrow;
  }

  get isMaxTagCountSet(): boolean {
    return this.snMaxMultipleCount !== Infinity;
  }

  @Output() readonly snOnSearch = new EventEmitter<string>();
  @Output() readonly snScrollToBottom = new EventEmitter<void>();
  @Output() readonly snOpenChange = new EventEmitter<boolean>();
  @Output() readonly snBlur = new EventEmitter<void>();
  @Output() readonly snFocus = new EventEmitter<void>();
  @ViewChild(CdkOverlayOrigin, { static: true, read: ElementRef }) originElement!: ElementRef;
  @ViewChild(CdkConnectedOverlay, { static: true }) cdkConnectedOverlay!: CdkConnectedOverlay;
  @ViewChild(SnSelectTopControlComponent, { static: true }) snSelectTopControlComponent!: SnSelectTopControlComponent;
  @ContentChildren(SnOptionComponent, { descendants: true }) listOfSnOptionComponent!: QueryList<SnOptionComponent>;
  @ContentChildren(SnOptionGroupComponent, { descendants: true })
  listOfSnOptionGroupComponent!: QueryList<SnOptionGroupComponent>;
  @ViewChild(SnOptionGroupComponent, { static: true, read: ElementRef }) snOptionGroupComponentElement!: ElementRef;
  @ViewChild(SnSelectTopControlComponent, { static: true, read: ElementRef })
  snSelectTopControlComponentElement!: ElementRef;
  private listOfValue$ = new BehaviorSubject<SnSafeAny[]>([]);
  private listOfTemplateItem$ = new BehaviorSubject<SnSelectItemInterface[]>([]);
  private listOfTagAndTemplateItem: SnSelectItemInterface[] = [];
  private searchValue: string = '';
  private isReactiveDriven = false;
  private value: SnSafeAny | SnSafeAny[];
  private _snShowArrow: boolean | undefined;
  private requestId: number = -1;
  private isSnDisableFirstChange: boolean = true;
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
      snValue: value,
      snLabel: value,
      type: 'item'
    };
  }

  onItemClick(value: SnSafeAny): void {
    this.activatedValue = value;
    if (this.snMode === 'default') {
      if (this.listOfValue.length === 0 || !this.compareWith(this.listOfValue[0], value)) {
        this.updateListOfValue([value]);
      }
      this.setOpenState(false);
    } else {
      const targetIndex = this.listOfValue.findIndex(o => this.compareWith(o, value));
      if (targetIndex !== -1) {
        const listOfValueAfterRemoved = this.listOfValue.filter((_, i) => i !== targetIndex);
        this.updateListOfValue(listOfValueAfterRemoved);
      } else if (this.listOfValue.length < this.snMaxMultipleCount) {
        const listOfValueAfterAdded = [...this.listOfValue, value];
        this.updateListOfValue(listOfValueAfterAdded);
      }
      this.focus();
      if (this.snAutoClearSearchValue) {
        this.clearInput();
      }
    }
  }

  onItemDelete(item: SnSelectItemInterface): void {
    const listOfSelectedValue = this.listOfValue.filter(v => !this.compareWith(v, item.snValue));
    this.updateListOfValue(listOfSelectedValue);
    this.clearInput();
  }

  updateListOfContainerItem(): void {
    let listOfContainerItem = this.listOfTagAndTemplateItem
      .filter(item => !item.snHide)
      .filter(item => {
        if (!this.snServerSearch && this.searchValue) {
          return this.snFilterOption(this.searchValue, item);
        } else {
          return true;
        }
      });
    if (this.snMode === 'tags' && this.searchValue) {
      const matchedItem = this.listOfTagAndTemplateItem.find(item => item.snLabel === this.searchValue);
      if (!matchedItem) {
        const tagItem = this.generateTagItem(this.searchValue);
        listOfContainerItem = [tagItem, ...listOfContainerItem];
        this.activatedValue = tagItem.snValue;
      } else {
        this.activatedValue = matchedItem.snValue;
      }
    }
    const activatedItem =
      listOfContainerItem.find(item => item.snLabel === this.searchValue) ||
      listOfContainerItem.find(item => this.compareWith(item.snValue, this.activatedValue)) ||
      listOfContainerItem.find(item => this.compareWith(item.snValue, this.listOfValue[0])) ||
      listOfContainerItem[0];
    this.activatedValue = (activatedItem && activatedItem.snValue) || null;
    let listOfGroupLabel: Array<string | number | TemplateRef<SnSafeAny> | null> = [];
    if (this.isReactiveDriven) {
      listOfGroupLabel = [...new Set(this.snOptions.filter(o => o.groupLabel).map(o => o.groupLabel!))];
    } else {
      if (this.listOfSnOptionGroupComponent) {
        listOfGroupLabel = this.listOfSnOptionGroupComponent.map(o => o.snLabel);
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
    this.snSelectTopControlComponent.clearInputValue();
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
    const model = covertListToModel(listOfValue, this.snMode);
    if (this.value !== model) {
      this.listOfValue = listOfValue;
      this.listOfValue$.next(listOfValue);
      this.value = model;
      this.onChange(this.value);
    }

    this.isMaxLimitReached =
      this.snMaxMultipleCount !== Infinity && this.listOfValue.length === this.snMaxMultipleCount;
  }

  onTokenSeparate(listOfLabel: string[]): void {
    const listOfMatchedValue = this.listOfTagAndTemplateItem
      .filter(item => listOfLabel.findIndex(label => label === item.snLabel) !== -1)
      .map(item => item.snValue)
      .filter(item => this.listOfValue.findIndex(v => this.compareWith(v, item)) === -1);
    if (this.snMode === 'multiple') {
      this.updateListOfValue([...this.listOfValue, ...listOfMatchedValue]);
    } else if (this.snMode === 'tags') {
      const listOfUnMatchedLabel = listOfLabel.filter(
        label => this.listOfTagAndTemplateItem.findIndex(item => item.snLabel === label) === -1
      );
      this.updateListOfValue([...this.listOfValue, ...listOfMatchedValue, ...listOfUnMatchedLabel]);
    }
    this.clearInput();
  }

  onKeyDown(e: KeyboardEvent): void {
    if (this.snDisabled) {
      return;
    }
    const listOfFilteredOptionNotDisabled = this.listOfContainerItem
      .filter(item => item.type === 'item')
      .filter(item => !item.snDisabled);
    const activatedIndex = listOfFilteredOptionNotDisabled.findIndex(item =>
      this.compareWith(item.snValue, this.activatedValue)
    );
    switch (e.keyCode) {
      case UP_ARROW:
        e.preventDefault();
        if (this.snOpen && listOfFilteredOptionNotDisabled.length > 0) {
          const preIndex = activatedIndex > 0 ? activatedIndex - 1 : listOfFilteredOptionNotDisabled.length - 1;
          this.activatedValue = listOfFilteredOptionNotDisabled[preIndex].snValue;
        }
        break;
      case DOWN_ARROW:
        e.preventDefault();
        if (this.snOpen && listOfFilteredOptionNotDisabled.length > 0) {
          const nextIndex = activatedIndex < listOfFilteredOptionNotDisabled.length - 1 ? activatedIndex + 1 : 0;
          this.activatedValue = listOfFilteredOptionNotDisabled[nextIndex].snValue;
        } else {
          this.setOpenState(true);
        }
        break;
      case ENTER:
        e.preventDefault();
        if (this.snOpen) {
          if (isNotNil(this.activatedValue) && activatedIndex !== -1) {
            this.onItemClick(this.activatedValue);
          }
        } else {
          this.setOpenState(true);
        }
        break;
      case SPACE:
        if (!this.snOpen) {
          this.setOpenState(true);
          e.preventDefault();
        }
        break;
      case TAB:
        if (this.snSelectOnTab) {
          if (this.snOpen) {
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
        if (!this.snOpen) {
          this.setOpenState(true);
        }
    }
  }

  setOpenState(value: boolean): void {
    if (this.snOpen !== value) {
      this.snOpen = value;
      this.snOpenChange.emit(value);
      this.onOpenChange();
      this.cdr.markForCheck();
    }
  }

  onOpenChange(): void {
    this.updateCdkConnectedOverlayStatus();
    if (this.snAutoClearSearchValue) {
      this.clearInput();
    }
  }

  onInputValueChange(value: string): void {
    this.searchValue = value;
    this.updateListOfContainerItem();
    this.snOnSearch.emit(value);
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
    this.snSelectTopControlComponent.focus();
  }

  blur(): void {
    this.snSelectTopControlComponent.blur();
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
          // down to the `sn-select`. But we'll trigger only local change detection if the `triggerWidth` has been changed.
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
    public snConfigService: SnConfigService,
    private cdr: ChangeDetectorRef,
    private host: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private platform: Platform,
    private focusMonitor: FocusMonitor,
    @Optional() private directionality: Directionality,
    @Host() @Optional() public noAnimation?: SnNoAnimationDirective,
    @Optional() public snFormStatusService?: SnFormStatusService,
    @Optional() private snFormNoStatusService?: SnFormNoStatusService
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
      const listOfValue = covertModelToList(modelValue, this.snMode);
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
    this.snDisabled = (this.isSnDisableFirstChange && this.snDisabled) || disabled;
    this.isSnDisableFirstChange = false;
    if (this.snDisabled) {
      this.setOpenState(false);
    }
    this.cdr.markForCheck();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { snOpen, snDisabled, snOptions, snStatus, snPlacement } = changes;
    if (snOpen) {
      this.onOpenChange();
    }
    if (snDisabled && this.snDisabled) {
      this.setOpenState(false);
    }
    if (snOptions) {
      this.isReactiveDriven = true;
      const listOfOptions = this.snOptions || [];
      const listOfTransformedItem = listOfOptions.map(item => {
        return {
          template: item.label instanceof TemplateRef ? item.label : null,
          snTitle: this.getTitle(item.title, item.label),
          snLabel: typeof item.label === 'string' || typeof item.label === 'number' ? item.label : null,
          snValue: item.value,
          snDisabled: item.disabled || false,
          snHide: item.hide || false,
          snCustomContent: item.label instanceof TemplateRef,
          groupLabel: item.groupLabel || null,
          type: 'item',
          key: item.key === undefined ? item.value : item.key
        };
      });
      this.listOfTemplateItem$.next(listOfTransformedItem);
    }
    if (snStatus) {
      this.setStatusStyles(this.snStatus, this.hasFeedback);
    }
    if (snPlacement) {
      const { currentValue } = snPlacement;
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
    this.snFormStatusService?.formStatusChanges
      .pipe(
        distinctUntilChanged((pre, cur) => {
          return pre.status === cur.status && pre.hasFeedback === cur.hasFeedback;
        }),
        withLatestFrom(this.snFormNoStatusService ? this.snFormNoStatusService.noFormStatus : observableOf(false)),
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
          this.snBlur.emit();
          Promise.resolve().then(() => {
            this.onTouched();
          });
        } else {
          this.focused = true;
          this.cdr.markForCheck();
          this.snFocus.emit();
        }
      });
    combineLatest([this.listOfValue$, this.listOfTemplateItem$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([listOfSelectedValue, listOfTemplateItem]) => {
        const listOfTagItem = listOfSelectedValue
          .filter(() => this.snMode === 'tags')
          .filter(value => listOfTemplateItem.findIndex(o => this.compareWith(o.snValue, value)) === -1)
          .map(
            value => this.listOfTopItem.find(o => this.compareWith(o.snValue, value)) || this.generateTagItem(value)
          );
        this.listOfTagAndTemplateItem = [...listOfTemplateItem, ...listOfTagItem];
        this.listOfTopItem = this.listOfValue
          .map(
            v =>
              [...this.listOfTagAndTemplateItem, ...this.listOfTopItem].find(item => this.compareWith(v, item.snValue))!
          )
          .filter(item => !!item);
        this.updateListOfContainerItem();
      });

    this.directionality.change?.pipe(takeUntil(this.destroy$)).subscribe((direction: Direction) => {
      this.dir = direction;
      this.cdr.detectChanges();
    });

    this.snConfigService
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
          if ((this.snOpen && this.snShowSearch) || this.snDisabled) {
            return;
          }

          this.ngZone.run(() => this.setOpenState(!this.snOpen));
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
      merge(this.listOfSnOptionGroupComponent.changes, this.listOfSnOptionComponent.changes)
        .pipe(
          startWith(true),
          switchMap(() =>
            merge(
              ...[
                this.listOfSnOptionComponent.changes,
                this.listOfSnOptionGroupComponent.changes,
                ...this.listOfSnOptionComponent.map(option => option.changes),
                ...this.listOfSnOptionGroupComponent.map(option => option.changes)
              ]
            ).pipe(startWith(true))
          ),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          const listOfOptionInterface = this.listOfSnOptionComponent.toArray().map(item => {
            const { template, snLabel, snValue, snKey, snDisabled, snHide, snCustomContent, groupLabel } = item;
            return {
              template,
              snLabel,
              snValue,
              snDisabled,
              snHide,
              snCustomContent,
              groupLabel,
              snTitle: this.getTitle(item.snTitle, item.snLabel),
              type: 'item',
              key: snKey === undefined ? snValue : snKey
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
    // render status if snStatus is set
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
