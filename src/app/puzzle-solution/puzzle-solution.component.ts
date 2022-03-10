import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { PuzzleInfo } from '../shared/puzzle-info';
import { PuzzleType } from '../shared/puzzle-type';
import { PuzzleSolveStep } from '../solver/puzzle';

@Component({
  selector: 'app-puzzle-solution',
  templateUrl: './puzzle-solution.component.html',
  styleUrls: ['./puzzle-solution.component.scss'],
})
export class PuzzleSolutionComponent implements OnInit, OnChanges {
  @Input()
  public puzzleSolution: Array<PuzzleSolveStep> | undefined;

  @Input()
  public puzzleInfo: PuzzleInfo | undefined;

  public readonly badType: PuzzleType = PuzzleType.BROKEN;

  public selectedIndex: number = -1;

  @Output()
  showSolution: EventEmitter<PuzzleSolveStep> = new EventEmitter<PuzzleSolveStep>();

  @Output()
  showFinal: EventEmitter<PuzzleSolveStep> = new EventEmitter<PuzzleSolveStep>();

  constructor() {}

  ngOnInit(): void {}

  showStep(index: number) {
    this.selectedIndex = index;
    this.showSolution.emit(this.puzzleSolution![index]);
  }

  showFinalAction() {
    this.selectedIndex = -2;
    this.showFinal.emit(this.puzzleSolution![this.puzzleSolution!.length - 1]);
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes && changes['puzzleSolution']) || changes['puzzleInfo']) {
      this.selectedIndex = -1;
    }
  }
}
