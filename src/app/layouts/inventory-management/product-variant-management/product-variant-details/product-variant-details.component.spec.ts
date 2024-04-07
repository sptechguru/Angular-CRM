import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantDetailsComponent } from './product-variant-details.component';

describe('ProductVariantDetailsComponent', () => {
  let component: ProductVariantDetailsComponent;
  let fixture: ComponentFixture<ProductVariantDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductVariantDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
