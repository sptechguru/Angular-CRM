import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsProductsComponent } from './deals-products.component';

describe('DealsProductsComponent', () => {
  let component: DealsProductsComponent;
  let fixture: ComponentFixture<DealsProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
