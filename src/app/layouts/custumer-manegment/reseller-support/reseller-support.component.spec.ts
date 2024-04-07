import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerSupportComponent } from './reseller-support.component';

describe('ResellerSupportComponent', () => {
  let component: ResellerSupportComponent;
  let fixture: ComponentFixture<ResellerSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
