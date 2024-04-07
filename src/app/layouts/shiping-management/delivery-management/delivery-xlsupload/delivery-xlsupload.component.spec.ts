import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryXlsuploadComponent } from './delivery-xlsupload.component';

describe('DeliveryXlsuploadComponent', () => {
  let component: DeliveryXlsuploadComponent;
  let fixture: ComponentFixture<DeliveryXlsuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryXlsuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryXlsuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
