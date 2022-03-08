import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleListingComponent } from './puzzle-listing.component';

describe('PuzzleListingComponent', () => {
  let component: PuzzleListingComponent;
  let fixture: ComponentFixture<PuzzleListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuzzleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
