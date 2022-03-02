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

  public readonly islands: Array<string> = [
    'Narukami Island',
    'Kannazuka Island',
    'Yashiori Island',
    'Watatsumi Island',
    'Seirai Island',
    'Tsurumi Island',
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

        let y = Number(item.y);

        this.locations.push(
          new LocationInfo(item.id, Number(item.x), y, LocationType.SPINNING)
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

          info.locationX = Number(item.x);
          info.locationY = y;

          if (item.camera) {
            info.camera = item.camera;
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
            PuzzleType.LIGHT,
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
