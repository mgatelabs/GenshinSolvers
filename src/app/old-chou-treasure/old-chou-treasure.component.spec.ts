import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OldChouTreasureComponent } from './old-chou-treasure.component';

describe('OldChouTreasureComponent', () => {
  let component: OldChouTreasureComponent;
  let fixture: ComponentFixture<OldChouTreasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OldChouTreasureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OldChouTreasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
