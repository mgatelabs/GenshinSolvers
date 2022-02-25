import { Injectable } from '@angular/core';
import { LocationInfo } from './location-info';
import { LocationType } from './location-type';
//import * as treeData from '../assets/location_trees.json';
import * as warpData from '../assets/location_teleports.json';
import * as cubeData from '../assets/location_cubes.json';
import * as sevenData from '../assets/location_seven.json';
import { PuzzleInfo } from './shared/puzzle-info';
import { PuzzleType } from './shared/puzzle-type';

@Injectable({
  providedIn: 'root',
})
export class DataSourceService {
  public locations: LocationInfo[];

  public puzzles: Map<String, PuzzleInfo> = new Map();

  constructor() {
    this.locations = [];

    {
      let temp: Array<any> = sevenData;
      for (let i = 0; i < temp.length; i++) {
        this.locations.push(
          new LocationInfo(
            temp[i].id,
            Number(temp[i].x),
            Number(temp[i].y),
            LocationType.SEVEN
          )
        );
      }
    }

    {
      let temp: Array<any> = warpData;
      for (let i = 0; i < temp.length; i++) {
        this.locations.push(
          new LocationInfo(
            temp[i].id,
            Number(temp[i].x),
            Number(temp[i].y),
            LocationType.WAYPOINT
          )
        );
      }
    }

    {
      let temp: Array<any> = cubeData;
      for (let i = 0; i < temp.length; i++) {
        let item = temp[i];

        this.locations.push(
          new LocationInfo(
            item.id,
            Number(item.x),
            Number(item.y),
            LocationType.SPINNING
          )
        );

        if (item.type) {
          let puzzleType: PuzzleType;
          if (item.type === 'LIGHT') {
            puzzleType = PuzzleType.LIGHT;
          } else {
            puzzleType = PuzzleType.SPIN;
          }

          let info = new PuzzleInfo(
            item.id,
            puzzleType,
            Number(item.count),
            [],
            []
          );
          this.puzzles.set(info.id, info);
        }
      }
    }
  }
}
