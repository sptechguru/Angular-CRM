import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarientLeadComponent } from './varient-lead.component';

describe('VarientLeadComponent', () => {
  let component: VarientLeadComponent;
  let fixture: ComponentFixture<VarientLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarientLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarientLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
