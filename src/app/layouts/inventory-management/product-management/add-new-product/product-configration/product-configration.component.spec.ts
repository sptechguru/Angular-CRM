import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductConfigrationComponent } from './product-configration.component';

describe('ProductConfigrationComponent', () => {
  let component: ProductConfigrationComponent;
  let fixture: ComponentFixture<ProductConfigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductConfigrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductConfigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
