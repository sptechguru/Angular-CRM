import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsInfoComponent } from './deals-info.component';

describe('DealsInfoComponent', () => {
  let component: DealsInfoComponent;
  let fixture: ComponentFixture<DealsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
