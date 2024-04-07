import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PickDateRangComponent } from './pick-date-rang.component';

describe('PickDateRangComponent', () => {
  let component: PickDateRangComponent;
  let fixture: ComponentFixture<PickDateRangComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickDateRangComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickDateRangComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
