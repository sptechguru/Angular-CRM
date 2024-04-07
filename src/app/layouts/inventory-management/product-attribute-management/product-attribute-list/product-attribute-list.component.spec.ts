import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAttributeListComponent } from './product-attribute-list.component';

describe('ProductAttributeListComponent', () => {
  let component: ProductAttributeListComponent;
  let fixture: ComponentFixture<ProductAttributeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductAttributeListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAttributeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
