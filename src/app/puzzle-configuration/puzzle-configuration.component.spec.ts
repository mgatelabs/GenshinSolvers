import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleConfigurationComponent } from './puzzle-configuration.component';

describe('PuzzleConfigurationComponent', () => {
  let component: PuzzleConfigurationComponent;
  let fixture: ComponentFixture<PuzzleConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
