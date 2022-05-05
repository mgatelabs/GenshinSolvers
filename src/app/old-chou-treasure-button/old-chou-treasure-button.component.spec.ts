import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldChouTreasureButtonComponent } from './old-chou-treasure-button.component';

describe('OldChouTreasureButtonComponent', () => {
  let component: OldChouTreasureButtonComponent;
  let fixture: ComponentFixture<OldChouTreasureButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldChouTreasureButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldChouTreasureButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
