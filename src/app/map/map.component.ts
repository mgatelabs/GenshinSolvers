import {
  Component,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import * as L from 'leaflet';
import { DataSourceService } from '../data-source.service';
import { LocationInfo } from '../location-info';
import { LocationType } from '../location-type';
import { PuzzleInfo } from '../shared/puzzle-info';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnChanges {
  private map: L.Map | undefined;

  @Input()
  public fixedHeight: boolean = false;

  @Input()
  public puzzleInfo: PuzzleInfo | undefined;

  @ViewChild('m1')
  private m1Ref: ElementRef;

  @ViewChild('m2')
  private m2Ref: ElementRef;

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['puzzleInfo']) {
      if (this.puzzleInfo && this.map) {
        this.map.setView(
          [-this.puzzleInfo.locationY, this.puzzleInfo.locationX],
          1
        );
      }
    }
  }

  private isInit: boolean = false;

  private initMap(): void {
    this.isInit = true;

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

    this.map = L.map(
      this.fixedHeight ? this.m2Ref.nativeElement : this.m1Ref.nativeElement,
      {
        crs: L.CRS.Simple,
        minZoom: -5,
      }
    );

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

    if (this.puzzleInfo) {
      this.map.setView(
        [-this.puzzleInfo.locationY, this.puzzleInfo.locationX],
        1
      );
    } else {
      this.map.setView([-6570, 1520], -3);
    }

    for (let i = 0; i < this.dataSource.locations.length; i++) {
      let info: LocationInfo = this.dataSource.locations[i];
      var sol = L.latLng([-info.y, info.x]);

      let ic: L.Icon;

      let content: string = '';

      let id = info.id;

      switch (this.dataSource.locations[i].type) {
        case LocationType.WAYPOINT:
          {
            ic = wayPointIcon;
            content = 'Teleporter';
          }
          break;
        case LocationType.LIGHTUP:
          {
            ic = puzzlePointIcon;
            //content = `Lightup Puzzle<br/><a href="puzzle?id=${id}" routerLinkActive="active">View Details</a>`;
          }
          break;
        case LocationType.SPINNING:
          {
            ic = puzzlePointIcon;
            //content = `Spinning Puzzle<br/><a href="puzzle?id=${id}" routerLinkActive="active">View Details</a>`;
          }
          break;
        case LocationType.SEVEN:
          {
            ic = sevenPointIcon;
            content = 'Statue of the Seven';
          }
          break;
        default:
          ic = mapIcon;
          break;
      }

      let m = L.marker(sol, { icon: ic });

      switch (this.dataSource.locations[i].type) {
        case LocationType.LIGHTUP:
        case LocationType.SPINNING:
          {
            m.addEventListener('click', () => {
              this.router.navigateByUrl(`/puzzle/${id}`);
            });
          }
          break;
        default:
          {
            m.bindPopup(content);
          }
          break;
      }

      m.addTo(this.map);
    }
  }

  constructor(private dataSource: DataSourceService, private router: Router) {}

  ngAfterViewInit(): void {
    if (this.isInit === false) {
      this.initMap();
    }
  }
}
