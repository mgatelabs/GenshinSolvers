import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleSolutionComponent } from './puzzle-solution.component';

describe('PuzzleSolutionComponent', () => {
  let component: PuzzleSolutionComponent;
  let fixture: ComponentFixture<PuzzleSolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleSolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleSolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
