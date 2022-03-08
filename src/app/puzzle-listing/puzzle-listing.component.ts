import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataSourceService } from '../data-source.service';
import { PuzzleInfo } from '../shared/puzzle-info';
import { PuzzleType } from '../shared/puzzle-type';

@Component({
  selector: 'app-puzzle-listing',
  templateUrl: './puzzle-listing.component.html',
  styleUrls: ['./puzzle-listing.component.scss'],
})
export class PuzzleListingComponent implements OnInit {
  public pageName: string = 'Unknown';
  public items: Array<PuzzleInfo> = [];

  constructor(
    public dataSource: DataSourceService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      let islandNumber: number = parseInt(params['island']);

      if (islandNumber >= -1 && islandNumber < this.dataSource.islands.length) {
        this.pageName =
          islandNumber >= 0 ? this.dataSource.islands[islandNumber] : 'All';

        let tempItems: Array<PuzzleInfo> = [];

        this.dataSource.puzzles.forEach(function (value, key) {
          if (value.type == PuzzleType.BROKEN) return;

          if (value.islandIndex == islandNumber || islandNumber == -1) {
            tempItems.push(value);
          }
        });

        tempItems.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

        this.items = tempItems;
      }
    });
  }

  ngOnInit(): void {}

  public getPuzzleType(info: PuzzleInfo) {
    switch (info.type) {
      case PuzzleType.LIGHT:
        return 'Light Up';
      default:
        return 'Spinning';
    }
  }
}
