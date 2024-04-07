import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReadyStockComponent } from './add-ready-stock.component';

describe('AddReadyStockComponent', () => {
  let component: AddReadyStockComponent;
  let fixture: ComponentFixture<AddReadyStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReadyStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddReadyStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
