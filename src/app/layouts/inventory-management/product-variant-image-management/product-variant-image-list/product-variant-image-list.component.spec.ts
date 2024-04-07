import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantImageListComponent } from './product-variant-image-list.component';

describe('ProductVariantImageListComponent', () => {
  let component: ProductVariantImageListComponent;
  let fixture: ComponentFixture<ProductVariantImageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductVariantImageListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariantImageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
