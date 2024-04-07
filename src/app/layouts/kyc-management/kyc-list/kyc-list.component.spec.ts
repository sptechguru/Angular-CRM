import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycListComponent } from './kyc-list.component';

describe('DashboardComponent', () => {
  let component: KycListComponent;
  let fixture: ComponentFixture<KycListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KycListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
