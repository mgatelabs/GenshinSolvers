import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { DataSourceService } from '../data-source.service';
import { PuzzleConfiguration } from '../shared/puzzle-configuration';
import { PuzzleDirection } from '../shared/puzzle-direction';
import { PuzzleInfo } from '../shared/puzzle-info';
import { PuzzleType } from '../shared/puzzle-type';
import { ThreeDViewComponent } from '../three-dview/three-dview.component';
/*
import {
  PuzzleDefinition,
  PuzzleState,
  unifiedSolution,
} from '../solver/puzzle';
*/
import * as SOLVER from '../solver/puzzle';

@Component({
  selector: 'app-puzzle-view',
  templateUrl: './puzzle-view.component.html',
  styleUrls: ['./puzzle-view.component.scss'],
})
export class PuzzleViewComponent implements OnInit, AfterViewInit {
  public puzzleInfo?: PuzzleInfo;

  public puzzleConfiguration: PuzzleConfiguration = new PuzzleConfiguration(
    PuzzleType.LIGHT,
    []
  );

  public puzzleSolution: Array<SOLVER.PuzzleSolveStep> | undefined;

  @ViewChild('threedview') someElement: ThreeDViewComponent;

  private afterInit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataSource: DataSourceService,
    private router: Router
  ) {
    this.route.params.subscribe((params) => {
      let puzzleId: string = params['puzzleId'];

      if (this.dataSource.puzzles.has(puzzleId)) {
        this.puzzleInfo = this.dataSource.puzzles.get(puzzleId)!;

        if (this.puzzleInfo!.type == PuzzleType.BROKEN) {
          this.puzzleConfiguration = new PuzzleConfiguration(
            PuzzleType.BROKEN,
            []
          );
        } else {
          let dirs = new Array<PuzzleDirection>();

          for (let i = 0; i < this.puzzleInfo.directions.length; i++) {
            dirs.push(this.puzzleInfo.directions[i]);
          }

          this.puzzleConfiguration = new PuzzleConfiguration(
            this.puzzleInfo.type,
            dirs
          );

          if (this.afterInit) {
            this.solvePuzzle();
          }
        }
      } else {
        this.puzzleInfo = undefined;
        this.puzzleConfiguration = new PuzzleConfiguration(
          PuzzleType.LIGHT,
          []
        );
      }
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.afterInit = true;
    if (this.puzzleInfo) {
      this.solvePuzzle();
    }
  }

  configurationChange(index: number) {
    this.puzzleConfiguration = this.puzzleConfiguration;

    this.someElement.updateDirections(
      this.puzzleConfiguration.directions,
      index
    );
    this.solvePuzzle();
  }

  updateConfigurationChange(index: number) {
    let shouldUpdate = this.puzzleInfo!.edit[index] === true;

    if (shouldUpdate) {
      this.puzzleConfiguration?.rotateIndex(index, false);
    }
    this.someElement.updateDirections(
      this.puzzleConfiguration.directions,
      index
    );
    if (shouldUpdate) {
      this.solvePuzzle();
    }
  }

  solvePuzzle() {
    let faces = [];
    for (let i = 0; i < this.puzzleConfiguration.directions.length; i++) {
      let val = 0;
      switch (this.puzzleConfiguration.directions[i]) {
        case PuzzleDirection.NORTH:
        case PuzzleDirection.ONE:
          val = 0;
          break;
        case PuzzleDirection.EAST:
        case PuzzleDirection.TWO:
          val = 1;
          break;
        case PuzzleDirection.SOUTH:
        case PuzzleDirection.THREE:
          val = 2;
          break;
        case PuzzleDirection.WEST:
          val = 3;
          break;
      }
      faces.push(val);
    }

    let conns: Array<Array<number>> = [];

    for (let i = 0; i < this.puzzleInfo!.connections.length; i++) {
      let sample: Array<number> = [];

      let selfDetected = false;

      // The effected
      for (let j = 0; j < this.puzzleInfo!.connections[i].length; j++) {
        let cur = this.puzzleInfo!.connections[i][j];
        if (cur === i) {
          selfDetected = true;
        }
        sample.push(this.puzzleInfo!.connections[i][j]);
      }
      if (!selfDetected && sample.length > 0) {
        // The main click
        sample.push(i);
      }
      conns.push(sample);
    }

    let puzzleDef: SOLVER.PuzzleDefinition = {
      initialState: faces,
      isFinalState: SOLVER.unifiedSolution,
      maximumNumber: this.puzzleInfo!.type == PuzzleType.SPIN ? 4 : 3,
      stateTransitions: conns,
    };

    let result = SOLVER.solvePuzzle(puzzleDef);

    let modified: Array<SOLVER.PuzzleSolveStep> = [];

    while (result) {
      let current = result;
      result = result.previousStep;
      if (result == undefined) {
        break;
      }
      modified.splice(0, 0, current);
    }

    this.puzzleSolution = modified;
  }

  showFinalStep(step: SOLVER.PuzzleSolveStep) {
    let toConvert: SOLVER.PuzzleState;
    let index = -1;
    toConvert = step.state!;
    let toSend = this.convertStepToDirections(toConvert);
    this.someElement.updateDirections(toSend, index);
  }

  private convertStepToDirections(
    toConvert: SOLVER.PuzzleState
  ): Array<number> {
    let toSend: Array<number> = [];
    for (let i = 0; i < toConvert.length; i++) {
      switch (toConvert[i]) {
        case 0:
          toSend.push(
            this.puzzleInfo!.type == PuzzleType.LIGHT
              ? PuzzleDirection.ONE
              : PuzzleDirection.NORTH
          );
          break;
        case 1:
          toSend.push(
            this.puzzleInfo!.type == PuzzleType.LIGHT
              ? PuzzleDirection.TWO
              : PuzzleDirection.EAST
          );
          break;
        case 2:
          toSend.push(
            this.puzzleInfo!.type == PuzzleType.LIGHT
              ? PuzzleDirection.THREE
              : PuzzleDirection.SOUTH
          );
          break;
        case 3:
          toSend.push(
            this.puzzleInfo!.type == PuzzleType.LIGHT
              ? PuzzleDirection.ZERO
              : PuzzleDirection.WEST
          );
          break;
      }
    }
    return toSend;
  }

  showSolutionStep(step: SOLVER.PuzzleSolveStep) {
    let toConvert: SOLVER.PuzzleState;
    let index = -1;
    if (step.previousStep) {
      toConvert = step.previousStep.state!;
      index = step.touchedCube!;
    } else {
      toConvert = step.state!;
    }
    let toSend = this.convertStepToDirections(toConvert);
    this.someElement.updateDirections(toSend, index);
  }

  resetPuzzle() {
    let dirs = new Array<PuzzleDirection>();

    for (let i = 0; i < this.puzzleInfo!.directions.length; i++) {
      dirs.push(this.puzzleInfo!.directions[i]);
    }

    this.puzzleConfiguration = new PuzzleConfiguration(
      this.puzzleInfo!.type,
      dirs
    );

    this.someElement.updateDirections(this.puzzleConfiguration.directions, -1);

    this.solvePuzzle();
  }
}
