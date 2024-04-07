import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewVariantComponent } from './new-variant.component';

describe('NewVariantComponent', () => {
  let component: NewVariantComponent;
  let fixture: ComponentFixture<NewVariantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewVariantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
