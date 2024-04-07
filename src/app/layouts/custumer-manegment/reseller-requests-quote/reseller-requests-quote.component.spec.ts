import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerRequestsQuoteComponent } from './reseller-requests-quote.component';

describe('ResellerRequestsQuoteComponent', () => {
  let component: ResellerRequestsQuoteComponent;
  let fixture: ComponentFixture<ResellerRequestsQuoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerRequestsQuoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerRequestsQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
