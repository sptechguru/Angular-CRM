import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequsetCallBackComponent } from './requset-call-back.component';

describe('RequsetCallBackComponent', () => {
  let component: RequsetCallBackComponent;
  let fixture: ComponentFixture<RequsetCallBackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequsetCallBackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequsetCallBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
