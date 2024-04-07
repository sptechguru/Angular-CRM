import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPartnerComponent } from './add-edit-partner.component';

describe('AddEditPartnerComponent', () => {
  let component: AddEditPartnerComponent;
  let fixture: ComponentFixture<AddEditPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
