import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TradeassuranceListComponent } from './tradeassurance-list.component';

describe('TradeassuranceListComponent', () => {
  let component: TradeassuranceListComponent;
  let fixture: ComponentFixture<TradeassuranceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TradeassuranceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TradeassuranceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
