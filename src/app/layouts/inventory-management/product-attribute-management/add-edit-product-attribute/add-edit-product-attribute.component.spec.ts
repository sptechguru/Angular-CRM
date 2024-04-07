import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductAttributeComponent } from './add-edit-product-attribute.component';

describe('AddEditProductAttributeComponent', () => {
  let component: AddEditProductAttributeComponent;
  let fixture: ComponentFixture<AddEditProductAttributeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditProductAttributeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
