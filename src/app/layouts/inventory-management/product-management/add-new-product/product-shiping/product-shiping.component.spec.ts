import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShipingComponent } from './product-shiping.component';

describe('ProductShipingComponent', () => {
  let component: ProductShipingComponent;
  let fixture: ComponentFixture<ProductShipingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductShipingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductShipingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
