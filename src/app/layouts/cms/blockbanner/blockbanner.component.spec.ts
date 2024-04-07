import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockbannerComponent } from './blockbanner.component';

describe('BlockbannerComponent', () => {
  let component: BlockbannerComponent;
  let fixture: ComponentFixture<BlockbannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockbannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockbannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
