import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstTaxTypeListComponent } from './gst-tax-type-list.component';

describe('GstTaxTypeListComponent', () => {
  let component: GstTaxTypeListComponent;
  let fixture: ComponentFixture<GstTaxTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstTaxTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstTaxTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
