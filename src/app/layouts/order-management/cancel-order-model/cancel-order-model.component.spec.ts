import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelOrderModelComponent } from './cancel-order-model.component';

describe('CancelOrderModelComponent', () => {
  let component: CancelOrderModelComponent;
  let fixture: ComponentFixture<CancelOrderModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelOrderModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelOrderModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
