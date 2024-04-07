import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactQueryListComponent } from './contact-query-list.component';

describe('ContactQueryListComponent', () => {
  let component: ContactQueryListComponent;
  let fixture: ComponentFixture<ContactQueryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactQueryListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
