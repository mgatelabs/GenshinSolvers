import { Injectable } from '@angular/core';
import { LocationInfo } from './location-info';
import { LocationType } from './location-type';
//import * as treeData from '../assets/location_trees.json';
import * as warpData from '../assets/location_teleports.json';
import * as cubeData from '../assets/location_cubes.json';
import * as sevenData from '../assets/location_seven.json';
import { PuzzleInfo } from './shared/puzzle-info';
import { PuzzleType } from './shared/puzzle-type';
import { PuzzleDirection } from './shared/puzzle-direction';

@Injectable({
  providedIn: 'root',
})
export class DataSourceService {
  public locations: LocationInfo[];

  public puzzles: Map<String, PuzzleInfo> = new Map();

  public totalPuzzles: number = 0;
  public workingPuzzles: number = 0;

  public readonly islands: Array<string> = [
    'Narukami Island',
    'Kannazuka Island',
    'Yashiori Island',
    'Watatsumi Island',
    'Seirai Island',
    'Tsurumi Island',
  ];

  public readonly islandLoopup: Map<string, number> = new Map([
    ['naru', 0],
    ['kann', 1],
    ['yash', 2],
    ['wata', 3],
    ['seir', 4],
    ['tsur', 5],
  ]);

  public readonly islandCounts: Array<[number, number]> = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  constructor() {
    this.locations = [];

    {
      let temp: Array<any> = sevenData;
      for (let i = 0; i < temp.length; i++) {
        let item = temp[i];
        let y = Number(item.y);
        if (y < 3500) {
          continue;
        }

        this.locations.push(
          new LocationInfo(
            temp[i].id,
            Number(temp[i].x),
            Number(y),
            LocationType.SEVEN
          )
        );
      }
    }

    {
      let temp: Array<any> = warpData;
      for (let i = 0; i < temp.length; i++) {
        let item = temp[i];
        let y = Number(item.y);
        if (y < 3500) {
          continue;
        }

        this.locations.push(
          new LocationInfo(
            temp[i].id,
            Number(temp[i].x),
            Number(y),
            LocationType.WAYPOINT
          )
        );
      }
    }

    {
      let temp: Array<any> = cubeData;
      for (let i = 0; i < temp.length; i++) {
        let item = temp[i];

        this.totalPuzzles++;

        let y = Number(item.y);

        this.locations.push(
          new LocationInfo(
            item.id,
            Number(item.x),
            y,
            item.type
              ? LocationType.SPINNING
              : item.link
              ? LocationType.SPINNING
              : LocationType.BROKEN,
            item.link || ''
          )
        );

        let islandIndex = this.islandLoopup.get(item.island)!;

        let islandRef = this.islandCounts[islandIndex];

        islandRef[0] += 1;

        if (item.link) {
          this.workingPuzzles++;
          islandRef[1] += 1;
        } else if (item.type) {
          this.workingPuzzles++;

          let puzzleType: PuzzleType;
          if (item.type === 'LIGHT') {
            puzzleType = PuzzleType.LIGHT;
            islandRef[1] += 1;
          } else if (item.type === 'SPIN') {
            puzzleType = PuzzleType.SPIN;
            islandRef[1] += 1;
          } else {
            puzzleType = PuzzleType.BROKEN;
          }

          let info = new PuzzleInfo(
            item.id,
            puzzleType,
            Number(item.count),
            [],
            []
          );

          info.islandIndex = islandIndex;
          info.locationX = Number(item.x);
          info.locationY = y;

          if (item.forced) {
            info.forced = [];
            for (let j = 0; j < item.forced.length; j++) {
              let v: number = 0;
              switch (item.forced[j]) {
                case 'N':
                  v = 0;
                  break;
                case 'E':
                  v = 1;
                  break;
                case 'S':
                  v = 2;
                  break;
                case 'W':
                  v = 3;
                  break;
              }
              info.forced.push(v);
            }
          }

          if (item.camera) {
            info.camera = item.camera;
          }

          if (item.edit) {
            info.edit = item.edit;
          } else {
            for (let j = 0; j < info.count; j++) {
              info.edit.push(true);
            }
          }

          if (item.face) {
            switch (item.face) {
              case 'N':
                info.facing = PuzzleDirection.NORTH;
                break;
              case 'E':
                info.facing = PuzzleDirection.EAST;
                break;
              case 'S':
                info.facing = PuzzleDirection.SOUTH;
                break;
              case 'W':
                info.facing = PuzzleDirection.WEST;
                break;
            }
          }

          info.directions = [];
          if (item.direction) {
            for (let j = 0; j < item.direction.length; j++) {
              switch (item.direction[j]) {
                case 'N':
                  info.directions.push(PuzzleDirection.NORTH);
                  break;
                case 'E':
                  info.directions.push(PuzzleDirection.EAST);
                  break;
                case 'S':
                  info.directions.push(PuzzleDirection.SOUTH);
                  break;
                case 'W':
                  info.directions.push(PuzzleDirection.WEST);
                  break;
                case '0':
                  info.directions.push(PuzzleDirection.ZERO);
                  break;
                case '1':
                  info.directions.push(PuzzleDirection.ONE);
                  break;
                case '2':
                  info.directions.push(PuzzleDirection.TWO);
                  break;
                case '3':
                  info.directions.push(PuzzleDirection.THREE);
                  break;
              }
            }
          } else {
            for (let j = 0; j < item.count; j++) {
              if (item.type === 'LIGHT') {
                info.directions.push(PuzzleDirection.ZERO);
              } else {
                info.directions.push(PuzzleDirection.NORTH);
              }
            }
          }

          if (item.ortho) {
            info.orthoWidth = item.ortho;
          }

          if (item.connection) {
            info.connections = item.connection;
          }

          if (item.description) {
            info.description = item.description;
          }

          if (item.position) {
            info.position = item.position;
          } else {
            for (let j = 0; j < item.count; j++) {
              info.position.push([j, 0, -j]);
            }
          }

          this.puzzles.set(info.id, info);
        } else {
          let info = new PuzzleInfo(
            item.id,
            PuzzleType.BROKEN,
            3,
            [PuzzleDirection.ZERO, PuzzleDirection.ZERO, PuzzleDirection.ZERO],
            [[], [], []]
          );

          info.locationX = Number(item.x);
          info.locationY = Number(item.y);

          this.puzzles.set(info.id, info);
        }
      }
    }
  }
}
