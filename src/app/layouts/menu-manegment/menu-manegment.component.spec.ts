import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuManegmentComponent } from './menu-manegment.component';

describe('MenuManegmentComponent', () => {
  let component: MenuManegmentComponent;
  let fixture: ComponentFixture<MenuManegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuManegmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuManegmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
