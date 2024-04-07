import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductVariantComponent } from './add-edit-product-variant.component';

describe('AddEditProductVariantComponent', () => {
  let component: AddEditProductVariantComponent;
  let fixture: ComponentFixture<AddEditProductVariantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditProductVariantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
