import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeManualPaymentComponent } from './make-manual-payment.component';

describe('MakeManualPaymentComponent', () => {
  let component: MakeManualPaymentComponent;
  let fixture: ComponentFixture<MakeManualPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeManualPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeManualPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
