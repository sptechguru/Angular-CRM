import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCatelogComponent } from './create-catelog.component';

describe('CreateCatelogComponent', () => {
  let component: CreateCatelogComponent;
  let fixture: ComponentFixture<CreateCatelogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCatelogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCatelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
