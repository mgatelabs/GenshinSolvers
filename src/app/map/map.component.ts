import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { DataSourceService } from '../data-source.service';
import { LocationInfo } from '../location-info';
import { LocationType } from '../location-type';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map: any;

  private initMap(): void {
    let mapIcon = new L.Icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    });

    let wayPointIcon = new L.Icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/waypoint.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    });

    let puzzlePointIcon = new L.Icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/puzzle.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    });

    let sevenPointIcon = new L.Icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/seven.png',
      shadowUrl: 'leaflet/marker-shadow.png',
    });

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -5,
    });

    let map_width = 5350;
    let map_x = -545;
    let map_y = -4025;

    var bounds: L.LatLngBounds = new L.LatLngBounds(
      L.latLng([map_y, map_x]),
      L.latLng([map_y - map_width, map_x + map_width])
    );

    var backgrondImage = L.imageOverlay(
      './assets/inazuma-map.png',
      bounds
    ).addTo(this.map);

    this.map.setView([-6570, 1520], -3);

    for (let i = 0; i < this.dataSource.locations.length; i++) {
      let info: LocationInfo = this.dataSource.locations[i];
      var sol = L.latLng([-info.y, info.x]);

      let ic: L.Icon;

      switch (this.dataSource.locations[i].type) {
        case LocationType.WAYPOINT:
          {
            ic = wayPointIcon;
          }
          break;
        case LocationType.LIGHTUP:
          {
            ic = puzzlePointIcon;
          }
          break;
        case LocationType.SPINNING:
          {
            ic = puzzlePointIcon;
          }
          break;
        case LocationType.SEVEN:
          {
            ic = sevenPointIcon;
          }
          break;
        default:
          ic = mapIcon;
          break;
      }

      L.marker(sol, { icon: ic }).addTo(this.map);
    }
  }

  constructor(private dataSource: DataSourceService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
