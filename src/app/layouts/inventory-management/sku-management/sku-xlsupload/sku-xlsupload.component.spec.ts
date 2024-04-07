import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuXlsuploadComponent } from './sku-xlsupload.component';

describe('SkuXlsuploadComponent', () => {
  let component: SkuXlsuploadComponent;
  let fixture: ComponentFixture<SkuXlsuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuXlsuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuXlsuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
