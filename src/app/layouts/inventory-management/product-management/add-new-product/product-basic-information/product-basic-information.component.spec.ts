import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBasicInformationComponent } from './product-basic-information.component';

describe('ProductBasicInformationComponent', () => {
  let component: ProductBasicInformationComponent;
  let fixture: ComponentFixture<ProductBasicInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBasicInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBasicInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
