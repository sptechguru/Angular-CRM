import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrmBulkComponent } from './add-crm-bulk.component';

describe('AddCrmBulkComponent', () => {
  let component: AddCrmBulkComponent;
  let fixture: ComponentFixture<AddCrmBulkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCrmBulkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCrmBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
