import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttributeToProductComponent } from './add-attribute-to-product.component';

describe('AddAttributeToProductComponent', () => {
  let component: AddAttributeToProductComponent;
  let fixture: ComponentFixture<AddAttributeToProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttributeToProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttributeToProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
