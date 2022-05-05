import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldChouTreasureRowComponent } from './old-chou-treasure-row.component';

describe('OldChouTreasureRowComponent', () => {
  let component: OldChouTreasureRowComponent;
  let fixture: ComponentFixture<OldChouTreasureRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldChouTreasureRowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldChouTreasureRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
