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

          if (item.camera) {
            info.camera = item.camera;
          }

          if (item.facing) {
            switch (item.facing) {
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

          if (item.connection) {
            info.connections = item.connection;
          }

          if (item.position) {
            info.position = item.position;
          } else {
            for (let j = 0; j < item.count; j++) {
              info.position.push([j, 0, -j]);
            }
          }

          this.puzzles.set(info.id, info);
        }
      }
    }
  }
}
