import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditGstTaxTypeComponent } from './add-edit-gst-tax-type.component';

describe('AddEditGstTaxTypeComponent', () => {
  let component: AddEditGstTaxTypeComponent;
  let fixture: ComponentFixture<AddEditGstTaxTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditGstTaxTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditGstTaxTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
