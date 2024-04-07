import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeValueListComponent } from './attribute-value-list.component';

describe('AttributeValueListComponent', () => {
  let component: AttributeValueListComponent;
  let fixture: ComponentFixture<AttributeValueListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttributeValueListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
