import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VarientImageComponent } from './varient-image.component';

describe('VarientImageComponent', () => {
  let component: VarientImageComponent;
  let fixture: ComponentFixture<VarientImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VarientImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VarientImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
