import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyStockComponent } from './ready-stock.component';

describe('ReadyStockComponent', () => {
  let component: ReadyStockComponent;
  let fixture: ComponentFixture<ReadyStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadyStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadyStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
