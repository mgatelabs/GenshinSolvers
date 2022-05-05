import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChouTreasureGrid } from '../shared/chou-treasure-grid';

@Component({
  selector: 'app-old-chou-treasure-area',
  templateUrl: './old-chou-treasure-area.component.html',
  styleUrls: ['./old-chou-treasure-area.component.scss'],
})
export class OldChouTreasureAreaComponent implements OnInit {
  constructor() {}

  @Input()
  public config: ChouTreasureGrid | undefined;

  @Output()
  cellClicked: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit(): void {}

  cellClickEvent(index: number) {
    this.cellClicked.emit(index);
  }
}
