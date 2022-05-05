import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldChouTreasureAreaComponent } from './old-chou-treasure-area.component';

describe('OldChouTreasureAreaComponent', () => {
  let component: OldChouTreasureAreaComponent;
  let fixture: ComponentFixture<OldChouTreasureAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldChouTreasureAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldChouTreasureAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
