

import { BACKSPACE } from '@angular/cdk/keycodes';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SnNoAnimationDirective } from 'ngx-sedna/core/no-animation';
import { SnSafeAny } from 'ngx-sedna/core/types';

import { SnSelectItemComponent } from './select-item.component';
import { SnSelectPlaceholderComponent } from './select-placeholder.component';
import { SnSelectSearchComponent } from './select-search.component';
import { SnSelectItemInterface, SnSelectModeType, SnSelectTopControlItemType } from './select.types';

@Component({
  selector: 'sn-select-top-control',
  exportAs: 'snSelectTopControl',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <!--single mode-->
    <ng-container [ngSwitch]="mode">
      <ng-container *ngSwitchCase="'default'">
        <sn-select-search
          [snId]="snId"
          [disabled]="disabled"
          [value]="inputValue!"
          [showInput]="showSearch"
          [mirrorSync]="false"
          [autofocus]="autofocus"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></sn-select-search>
        <sn-select-item
          *ngIf="isShowSingleLabel"
          [deletable]="false"
          [disabled]="false"
          [removeIcon]="removeIcon"
          [label]="listOfTopItem[0].snLabel"
          [contentTemplateOutlet]="customTemplate"
          [contentTemplateOutletContext]="listOfTopItem[0]"
        ></sn-select-item>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <!--multiple or tags mode-->
        <sn-select-item
          *ngFor="let item of listOfSlicedItem; trackBy: trackValue"
          [removeIcon]="removeIcon"
          [label]="item.snLabel"
          [disabled]="item.snDisabled || disabled"
          [contentTemplateOutlet]="item.contentTemplateOutlet"
          [deletable]="true"
          [contentTemplateOutletContext]="item.contentTemplateOutletContext"
          (delete)="onDeleteItem(item.contentTemplateOutletContext)"
        ></sn-select-item>
        <sn-select-search
          [snId]="snId"
          [disabled]="disabled"
          [value]="inputValue!"
          [autofocus]="autofocus"
          [showInput]="true"
          [mirrorSync]="true"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></sn-select-search>
      </ng-container>
    </ng-container>
    <sn-select-placeholder *ngIf="isShowPlaceholder" [placeholder]="placeHolder"></sn-select-placeholder>
  `,
  host: { class: 'ant-select-selector' },
  imports: [
    NgSwitch,
    SnSelectSearchComponent,
    NgSwitchCase,
    SnSelectItemComponent,
    NgIf,
    NgSwitchDefault,
    NgFor,
    SnSelectPlaceholderComponent
  ],
  standalone: true
})
export class SnSelectTopControlComponent implements OnChanges, OnInit, OnDestroy {
  @Input() snId: string | null = null;
  @Input() showSearch = false;
  @Input() placeHolder: string | TemplateRef<SnSafeAny> | null = null;
  @Input() open = false;
  @Input() maxTagCount: number = Infinity;
  @Input() autofocus = false;
  @Input() disabled = false;
  @Input() mode: SnSelectModeType = 'default';
  @Input() customTemplate: TemplateRef<{ $implicit: SnSelectItemInterface }> | null = null;
  @Input() maxTagPlaceholder: TemplateRef<{ $implicit: SnSafeAny[] }> | null = null;
  @Input() removeIcon: TemplateRef<SnSafeAny> | null = null;
  @Input() listOfTopItem: SnSelectItemInterface[] = [];
  @Input() tokenSeparators: string[] = [];
  @Output() readonly tokenize = new EventEmitter<string[]>();
  @Output() readonly inputValueChange = new EventEmitter<string>();
  @Output() readonly deleteItem = new EventEmitter<SnSelectItemInterface>();
  @ViewChild(SnSelectSearchComponent) snSelectSearchComponent!: SnSelectSearchComponent;
  listOfSlicedItem: SnSelectTopControlItemType[] = [];
  isShowPlaceholder = true;
  isShowSingleLabel = false;
  isComposing = false;
  inputValue: string | null = null;

  private destroy$ = new Subject<void>();

  updateTemplateVariable(): void {
    const isSelectedValueEmpty = this.listOfTopItem.length === 0;
    this.isShowPlaceholder = isSelectedValueEmpty && !this.isComposing && !this.inputValue;
    this.isShowSingleLabel = !isSelectedValueEmpty && !this.isComposing && !this.inputValue;
  }

  isComposingChange(isComposing: boolean): void {
    this.isComposing = isComposing;
    this.updateTemplateVariable();
  }

  onInputValueChange(value: string): void {
    if (value !== this.inputValue) {
      this.inputValue = value;
      this.updateTemplateVariable();
      this.inputValueChange.emit(value);
      this.tokenSeparate(value, this.tokenSeparators);
    }
  }

  tokenSeparate(inputValue: string, tokenSeparators: string[]): void {
    const includesSeparators = (str: string, separators: string[]): boolean => {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < separators.length; ++i) {
        if (str.lastIndexOf(separators[i]) > 0) {
          return true;
        }
      }
      return false;
    };
    const splitBySeparators = (str: string, separators: string[]): string[] => {
      const reg = new RegExp(`[${separators.join()}]`);
      const array = str.split(reg).filter(token => token);
      return [...new Set(array)];
    };
    if (
      inputValue &&
      inputValue.length &&
      tokenSeparators.length &&
      this.mode !== 'default' &&
      includesSeparators(inputValue, tokenSeparators)
    ) {
      const listOfLabel = splitBySeparators(inputValue, tokenSeparators);
      this.tokenize.next(listOfLabel);
    }
  }

  clearInputValue(): void {
    if (this.snSelectSearchComponent) {
      this.snSelectSearchComponent.clearInputValue();
    }
  }

  focus(): void {
    if (this.snSelectSearchComponent) {
      this.snSelectSearchComponent.focus();
    }
  }

  blur(): void {
    if (this.snSelectSearchComponent) {
      this.snSelectSearchComponent.blur();
    }
  }

  trackValue(_index: number, option: SnSelectTopControlItemType): SnSafeAny {
    return option.snValue;
  }

  onDeleteItem(item: SnSelectItemInterface): void {
    if (!this.disabled && !item.snDisabled) {
      this.deleteItem.next(item);
    }
  }

  constructor(
    private elementRef: ElementRef<HTMLElement>,
    private ngZone: NgZone,
    @Host() @Optional() public noAnimation: SnNoAnimationDirective | null
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    const { listOfTopItem, maxTagCount, customTemplate, maxTagPlaceholder } = changes;
    if (listOfTopItem) {
      this.updateTemplateVariable();
    }
    if (listOfTopItem || maxTagCount || customTemplate || maxTagPlaceholder) {
      const listOfSlicedItem: SnSelectTopControlItemType[] = this.listOfTopItem.slice(0, this.maxTagCount).map(o => ({
        snLabel: o.snLabel,
        snValue: o.snValue,
        snDisabled: o.snDisabled,
        contentTemplateOutlet: this.customTemplate,
        contentTemplateOutletContext: o
      }));
      if (this.listOfTopItem.length > this.maxTagCount) {
        const exceededLabel = `+ ${this.listOfTopItem.length - this.maxTagCount} ...`;
        const listOfSelectedValue = this.listOfTopItem.map(item => item.snValue);
        const exceededItem = {
          snLabel: exceededLabel,
          snValue: '$$__sn_exceeded_item',
          snDisabled: true,
          contentTemplateOutlet: this.maxTagPlaceholder,
          contentTemplateOutletContext: listOfSelectedValue.slice(this.maxTagCount)
        };
        listOfSlicedItem.push(exceededItem);
      }
      this.listOfSlicedItem = listOfSlicedItem;
    }
  }

  ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<MouseEvent>(this.elementRef.nativeElement, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {
          // `HTMLElement.focus()` is a native DOM API which doesn't require Angular to run change detection.
          if (event.target !== this.snSelectSearchComponent.inputElement.nativeElement) {
            this.snSelectSearchComponent.focus();
          }
        });

      fromEvent<KeyboardEvent>(this.elementRef.nativeElement, 'keydown')
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {
          if (event.target instanceof HTMLInputElement) {
            const inputValue = event.target.value;

            if (
              event.keyCode === BACKSPACE &&
              this.mode !== 'default' &&
              !inputValue &&
              this.listOfTopItem.length > 0
            ) {
              event.preventDefault();
              // Run change detection only if the user has pressed the `Backspace` key and the following condition is met.
              this.ngZone.run(() => this.onDeleteItem(this.listOfTopItem[this.listOfTopItem.length - 1]));
            }
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}
