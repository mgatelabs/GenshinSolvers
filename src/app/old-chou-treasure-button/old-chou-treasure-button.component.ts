import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ChouTreasureGrid } from '../shared/chou-treasure-grid';
import { ChouTreasureTypes } from '../shared/chou-treasure-types';

@Component({
  selector: 'app-old-chou-treasure-button',
  templateUrl: './old-chou-treasure-button.component.html',
  styleUrls: ['./old-chou-treasure-button.component.scss'],
})
export class OldChouTreasureButtonComponent implements OnInit {
  public label: String = '?';

  @ViewChild('thebutton', { read: ElementRef, static: false })
  public thebutton: ElementRef;

  @Input()
  public y: number = 0;

  @Input()
  public x: number = 0;

  public _config: ChouTreasureGrid | undefined;

  @Output()
  cellClicked: EventEmitter<number> = new EventEmitter<number>();

  @Input() set config(newConfig: ChouTreasureGrid | undefined) {
    this._config = newConfig;
    if (this._config) {
      let value = this._config!.grid![this.y][this.x];

      let mode = '';

      switch (value) {
        case ChouTreasureTypes.BOMB:
          this.label = 'BOMB';
          mode = 'barrel';

          break;
        case ChouTreasureTypes.CABBAGE:
          this.label = 'CABBAGE';
          mode = 'cabbage';
          break;
        case ChouTreasureTypes.EMPTY:
          this.label = 'EMPTY';
          mode = 'empty';
          break;
        case ChouTreasureTypes.ORE:
          this.label = 'ORE';
          mode = 'iron';
          break;
        case ChouTreasureTypes.POTENTIAL_BOMB:
          this.label = '?BOMB?';
          mode = 'question';
          break;
        case ChouTreasureTypes.SAFE_SPOT:
          this.label = 'SAFE';
          mode = 'safe';
          break;
        case ChouTreasureTypes.TREASURE:
          this.label = 'TREASURE';
          mode = 'safe';
          break;
        case ChouTreasureTypes.UNKNOWN:
          this.label = '???';
          mode = 'unknown';
          break;
      }

      if (this.thebutton && this.thebutton.nativeElement) {
        this.thebutton.nativeElement.setAttribute('mode', mode);
      }
    } else {
      this.label = '?';
    }
  }

  constructor() {}

  ngOnInit(): void {}

  buttonPressed() {
    console.log('C1');
    this.cellClicked.emit(this.y * 5 + this.x);
  }
}
