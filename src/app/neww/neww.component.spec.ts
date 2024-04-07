import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewwComponent } from './neww.component';

describe('NewwComponent', () => {
  let component: NewwComponent;
  let fixture: ComponentFixture<NewwComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewwComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
