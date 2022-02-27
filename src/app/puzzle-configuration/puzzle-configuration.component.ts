import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PuzzleConfiguration } from '../shared/puzzle-configuration';
import { PuzzleDirection } from '../shared/puzzle-direction';

@Component({
  selector: 'app-puzzle-configuration',
  templateUrl: './puzzle-configuration.component.html',
  styleUrls: ['./puzzle-configuration.component.scss'],
})
export class PuzzleConfigurationComponent implements OnInit {
  @Input()
  public puzzleConfiguration: PuzzleConfiguration | undefined;

  constructor() {}

  ngOnInit(): void {}

  @Output()
  configurationChanged: EventEmitter<string> = new EventEmitter<string>();

  public getDirectionValue(dir: PuzzleDirection) {
    switch (dir) {
      case PuzzleDirection.NORTH:
        return 'N';
      case PuzzleDirection.EAST:
        return 'E';
      case PuzzleDirection.SOUTH:
        return 'S';
      case PuzzleDirection.WEST:
        return 'W';

      case PuzzleDirection.ZERO:
        return '0';
      case PuzzleDirection.ONE:
        return '1';
      case PuzzleDirection.TWO:
        return '2';
      case PuzzleDirection.THREE:
        return '3';
      default:
        return '?';
    }
  }

  arrowClicked(i: number, isLeft: boolean) {
    if (this.puzzleConfiguration?.rotateIndex(i, isLeft)) {
      this.configurationChanged.emit('go');
    }
  }
}
