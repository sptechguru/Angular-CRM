import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrandingAmountComponent } from './add-branding-amount.component';

describe('AddBrandingAmountComponent', () => {
  let component: AddBrandingAmountComponent;
  let fixture: ComponentFixture<AddBrandingAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBrandingAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBrandingAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
