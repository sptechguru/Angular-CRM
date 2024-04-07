import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductDetailsComponent } from './new-product-details.component';

describe('NewProductDetailsComponent', () => {
  let component: NewProductDetailsComponent;
  let fixture: ComponentFixture<NewProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
