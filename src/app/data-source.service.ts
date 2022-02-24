import { Injectable } from '@angular/core';
import * as treeData from '../assets/location_trees.json';
import { LocationInfo } from './location-info';
import { LocationType } from './location-type';
import * as warpData from '../assets/location_teleports.json';

@Injectable({
  providedIn: 'root',
})
export class DataSourceService {
  public locations: LocationInfo[];

  constructor() {
    this.locations = [];

    {
      let temp: Array<any> = treeData;
      for (let i = 0; i < temp.length; i++) {
        this.locations.push(
          new LocationInfo(
            Number(temp[i].x),
            Number(temp[i].y),
            LocationType.TREE
          )
        );
      }
    }

    {
      let temp: Array<any> = warpData;
      for (let i = 0; i < temp.length; i++) {
        this.locations.push(
          new LocationInfo(
            Number(temp[i].x),
            Number(temp[i].y),
            LocationType.WAYPOINT
          )
        );
      }
    }
  }
}
