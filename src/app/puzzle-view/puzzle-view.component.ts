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
    }
  }

  configurationChange(misc: string) {
    this.puzzleConfiguration = this.puzzleConfiguration;

    this.someElement.updateDirections(this.puzzleConfiguration.directions);
  }
}
