import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarientOfferComponent } from './varient-offer.component';

describe('VarientOfferComponent', () => {
  let component: VarientOfferComponent;
  let fixture: ComponentFixture<VarientOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarientOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarientOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
