import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormItemComponent } from './form-item.component';

describe('FormItemComponent', () => {
  let component: FormItemComponent;
  let fixture: ComponentFixture<FormItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormItemComponent]
    });
    fixture = TestBed.createComponent(FormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
