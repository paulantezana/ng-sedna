import { ComponentFixture, TestBed } from '@angular/core/testing';

import { paginationComponent } from './pagination.component';

describe('paginationComponent', () => {
  let component: paginationComponent;
  let fixture: ComponentFixture<paginationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [paginationComponent]
    });
    fixture = TestBed.createComponent(paginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
