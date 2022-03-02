import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PuzzleInfo } from '../shared/puzzle-info';
import { PuzzleType } from '../shared/puzzle-type';
import { PuzzleSolveStep } from '../solver/puzzle';

@Component({
  selector: 'app-puzzle-solution',
  templateUrl: './puzzle-solution.component.html',
  styleUrls: ['./puzzle-solution.component.scss'],
})
export class PuzzleSolutionComponent implements OnInit {
  @Input()
  public puzzleSolution: Array<PuzzleSolveStep> | undefined;

  @Input()
  public puzzleInfo: PuzzleInfo | undefined;

  public readonly badType: PuzzleType = PuzzleType.BROKEN;

  @Output()
  showSolution: EventEmitter<PuzzleSolveStep> = new EventEmitter<PuzzleSolveStep>();

  @Output()
  showFinal: EventEmitter<PuzzleSolveStep> = new EventEmitter<PuzzleSolveStep>();

  constructor() {}

  ngOnInit(): void {}

  showStep(index: number) {
    this.showSolution.emit(this.puzzleSolution![index]);
  }

  showFinalAction() {
    this.showFinal.emit(this.puzzleSolution![this.puzzleSolution!.length - 1]);
  }
}
