import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPackagingListComponent } from './order-packaging-list.component';

describe('DashboardComponent', () => {
  let component: OrderPackagingListComponent;
  let fixture: ComponentFixture<OrderPackagingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPackagingListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPackagingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
