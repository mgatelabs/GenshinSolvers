import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  public puzzleId: string;
  public puzzleInfo?: PuzzleInfo;

  public puzzleConfiguration: PuzzleConfiguration = new PuzzleConfiguration(
    PuzzleType.LIGHT,
    []
  );

  public puzzleSolution: Array<SOLVER.PuzzleSolveStep> | undefined;

  @ViewChild('threedview') someElement: ThreeDViewComponent;

  constructor(
    private route: ActivatedRoute,
    private dataSource: DataSourceService
  ) {}

  ngOnInit(): void {
    var self = this;
    this.route.queryParams.subscribe((params) => {
      // Need to get the ID of the puzzle
      self.puzzleId = params['id'];

      if (this.dataSource.puzzles.has(this.puzzleId)) {
        this.puzzleInfo = this.dataSource.puzzles.get(this.puzzleId)!;

        let dirs = new Array<PuzzleDirection>();

        for (let i = 0; i < this.puzzleInfo.directions.length; i++) {
          dirs.push(this.puzzleInfo.directions[i]);
        }

        this.puzzleConfiguration = new PuzzleConfiguration(
          this.puzzleInfo.type,
          dirs
        );
      } else {
        this.puzzleInfo = undefined;
        this.puzzleConfiguration = new PuzzleConfiguration(
          PuzzleType.LIGHT,
          []
        );
      }

      console.log('Found Puzzle ID: ' + self.puzzleId);
    });
  }

  ngAfterViewInit(): void {
    if (this.puzzleInfo != null) {
      this.someElement.puzzleInfo = this.puzzleInfo!;
      this.someElement.startView();
      this.solvePuzzle();
    }
  }

  configurationChange(misc: number) {
    this.puzzleConfiguration = this.puzzleConfiguration;

    this.someElement.updateDirections(
      this.puzzleConfiguration.directions,
      misc
    );

    this.solvePuzzle();
  }

  solvePuzzle() {
    let faces = [];
    for (let i = 0; i < this.puzzleConfiguration.directions.length; i++) {
      let val = 0;
      switch (this.puzzleConfiguration.directions[i]) {
        case PuzzleDirection.NORTH:
        case PuzzleDirection.ZERO:
          val = 0;
          break;
        case PuzzleDirection.EAST:
        case PuzzleDirection.ONE:
          val = 1;
          break;
        case PuzzleDirection.SOUTH:
        case PuzzleDirection.TWO:
          val = 2;
          break;
        case PuzzleDirection.WEST:
        case PuzzleDirection.THREE:
          val = 3;
          break;
      }
      faces.push(val);
    }

    let conns: Array<Array<number>> = [];

    for (let i = 0; i < this.puzzleInfo!.connections.length; i++) {
      let sample: Array<number> = [];
      // The main click
      sample.push(i);
      // The effected
      for (let j = 0; j < this.puzzleInfo!.connections[i].length; j++) {
        sample.push(this.puzzleInfo!.connections[i][j]);
      }
      conns.push(sample);
    }

    let puzzleDef: SOLVER.PuzzleDefinition = {
      initialState: faces,
      isFinalState: SOLVER.unifiedSolution,
      maximumNumber: 4,
      stateTransitions: conns,
    };

    //console.log(this.puzzleInfo);

    console.log(puzzleDef);

    let result = SOLVER.solvePuzzle(puzzleDef);

    let modified: Array<SOLVER.PuzzleSolveStep> = [];

    while (result) {
      let current = result;
      modified.splice(0, 0, current);
      result = result.previousStep;
    }

    this.puzzleSolution = modified;
  }
}
