import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductXlsComponent } from './create-product-xls.component';

describe('CreateProductXlsComponent', () => {
  let component: CreateProductXlsComponent;
  let fixture: ComponentFixture<CreateProductXlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProductXlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProductXlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
