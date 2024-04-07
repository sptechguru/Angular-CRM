import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatelogManegmentComponent } from './catelog-manegment.component';

describe('CatelogManegmentComponent', () => {
  let component: CatelogManegmentComponent;
  let fixture: ComponentFixture<CatelogManegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatelogManegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatelogManegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
