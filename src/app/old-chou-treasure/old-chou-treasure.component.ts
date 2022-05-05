import { Component, OnInit } from '@angular/core';
import { ChouTreasureGrid } from '../shared/chou-treasure-grid';

@Component({
  selector: 'app-old-chou-treasure',
  templateUrl: './old-chou-treasure.component.html',
  styleUrls: ['./old-chou-treasure.component.scss'],
})
export class OldChouTreasureComponent implements OnInit {
  constructor() {}

  public grid: ChouTreasureGrid = new ChouTreasureGrid(undefined);

  ngOnInit(): void {}

  cellClickEvent(index: number) {
    let x = index % 5;
    let y = Math.floor(index / 5);
    this.grid.updateSpot(x, y);
    this.grid = new ChouTreasureGrid(this.grid);
  }

  public resetGrid() {
    this.grid = new ChouTreasureGrid(undefined);
  }
}
