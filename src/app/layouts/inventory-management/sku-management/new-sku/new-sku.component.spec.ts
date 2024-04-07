import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSkuComponent } from './new-sku.component';

describe('NewSkuComponent', () => {
  let component: NewSkuComponent;
  let fixture: ComponentFixture<NewSkuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSkuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSkuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
