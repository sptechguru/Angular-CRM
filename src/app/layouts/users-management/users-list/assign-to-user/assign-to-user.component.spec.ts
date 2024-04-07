import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToUserComponent } from './assign-to-user.component';

describe('AssignToUserComponent', () => {
  let component: AssignToUserComponent;
  let fixture: ComponentFixture<AssignToUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignToUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignToUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
