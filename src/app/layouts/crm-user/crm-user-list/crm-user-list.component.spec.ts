import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrmUserListComponent } from './crm-user-list.component';

describe('CrmUserListComponent', () => {
  let component: CrmUserListComponent;
  let fixture: ComponentFixture<CrmUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrmUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrmUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
