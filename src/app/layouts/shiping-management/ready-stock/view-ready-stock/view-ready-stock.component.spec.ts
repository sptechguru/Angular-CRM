import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReadyStockComponent } from './view-ready-stock.component';

describe('ViewReadyStockComponent', () => {
  let component: ViewReadyStockComponent;
  let fixture: ComponentFixture<ViewReadyStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewReadyStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewReadyStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
