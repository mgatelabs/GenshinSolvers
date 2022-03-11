import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapKeyComponent } from './map-key.component';

describe('MapKeyComponent', () => {
  let component: MapKeyComponent;
  let fixture: ComponentFixture<MapKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapKeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
