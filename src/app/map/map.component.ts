import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { DataSourceService } from '../data-source.service';
import { LocationInfo } from '../location-info';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map: any;

  private initMap(): void {
    /*
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });
    */

    this.map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -5,
    });

    var bounds: L.LatLngBounds = new L.LatLngBounds(
      L.latLng([-3000, -550]),
      L.latLng([-9500.5, 5023])
    );

    var image = L.imageOverlay('uqm_map_full.png', bounds).addTo(this.map);

    this.map.setView([-6570, 1520], -3);

    for (let i = 0; i < this.dataSource.locations.length; i++) {
      let info: LocationInfo = this.dataSource.locations[i];
      var sol = L.latLng([-info.y, info.x]);
      L.marker(sol).addTo(this.map);
    }
  }

  constructor(private dataSource: DataSourceService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
