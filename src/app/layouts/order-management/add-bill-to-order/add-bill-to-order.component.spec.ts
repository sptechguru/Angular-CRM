import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBillToOrderComponent } from './add-bill-to-order.component';

describe('AddBillToOrderComponent', () => {
  let component: AddBillToOrderComponent;
  let fixture: ComponentFixture<AddBillToOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBillToOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBillToOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
