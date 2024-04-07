import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCrmUserDetailsComponent } from './view-crm-user-details.component';

describe('ViewCrmUserDetailsComponent', () => {
  let component: ViewCrmUserDetailsComponent;
  let fixture: ComponentFixture<ViewCrmUserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCrmUserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCrmUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
