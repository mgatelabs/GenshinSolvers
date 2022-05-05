import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChouTreasureGrid } from '../shared/chou-treasure-grid';

@Component({
  selector: 'app-old-chou-treasure-row',
  templateUrl: './old-chou-treasure-row.component.html',
  styleUrls: ['./old-chou-treasure-row.component.scss'],
})
export class OldChouTreasureRowComponent implements OnInit {
  @Input()
  public y: number = 0;

  @Input()
  public config: ChouTreasureGrid | undefined;

  @Output()
  cellClicked: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  cellClickEvent(index: number) {
    this.cellClicked.emit(index);
  }
}
