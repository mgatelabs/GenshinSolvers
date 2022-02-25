import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDViewComponent } from './three-dview.component';

describe('ThreeDViewComponent', () => {
  let component: ThreeDViewComponent;
  let fixture: ComponentFixture<ThreeDViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeDViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeDViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
