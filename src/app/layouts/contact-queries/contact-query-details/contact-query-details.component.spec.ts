import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactQueryDetailsComponent } from './contact-query-details.component';

describe('ContactQueryDetailsComponent', () => {
  let component: ContactQueryDetailsComponent;
  let fixture: ComponentFixture<ContactQueryDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactQueryDetailsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactQueryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
