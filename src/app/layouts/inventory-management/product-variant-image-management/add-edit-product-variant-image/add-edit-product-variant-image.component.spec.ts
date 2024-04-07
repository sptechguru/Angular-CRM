import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductVariantImageComponent } from './add-edit-product-variant-image.component';

describe('AddEditProductVariantImageComponent', () => {
  let component: AddEditProductVariantImageComponent;
  let fixture: ComponentFixture<AddEditProductVariantImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditProductVariantImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductVariantImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
