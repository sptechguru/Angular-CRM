import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerFeedbackComponent } from './reseller-feedback.component';

describe('ResellerFeedbackComponent', () => {
  let component: ResellerFeedbackComponent;
  let fixture: ComponentFixture<ResellerFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
