import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerRequestsComponent } from './reseller-requests.component';

describe('ResellerRequestsComponent', () => {
  let component: ResellerRequestsComponent;
  let fixture: ComponentFixture<ResellerRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
