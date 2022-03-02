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

  private origX: number = 0;
  private origY: number = 0;
  private origZoom: number = 3;

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes['puzzleInfo']) {
      if (this.puzzleInfo && this.map) {
        this.origX = this.puzzleInfo.locationX;
        this.origY = -this.puzzleInfo.locationY;
        this.origZoom = 1;

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

    this.map.setMinZoom(-5);
    this.map.setMaxZoom(1);

    let map_width = 5350;
    let map_x = -545;
    let map_y = -4025;

    var bounds: L.LatLngBounds = new L.LatLngBounds(
      L.latLng([map_y, map_x]),
      L.latLng([map_y - map_width, map_x + map_width])
    );

    let offset = 900;

    var maxBounds: L.LatLngBounds = new L.LatLngBounds(
      L.latLng([map_y + offset, map_x - offset]),
      L.latLng([map_y - map_width - offset, map_x + map_width + offset])
    );

    this.map.setMaxBounds(maxBounds);

    var backgrondImage = L.imageOverlay(
      './assets/inazuma-map.png',
      bounds
    ).addTo(this.map);

    if (this.puzzleInfo) {
      this.origX = this.puzzleInfo.locationX;
      this.origY = -this.puzzleInfo.locationY;
      this.origZoom = 1;

      this.map.setView(
        [-this.puzzleInfo.locationY, this.puzzleInfo.locationX],
        1
      );
    } else {
      this.origX = 1520;
      this.origY = -6570;
      this.origZoom = -3;
    }

    this.map.setView([this.origY, this.origX], this.origZoom);

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
            content = `Teleporter`;
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

  constructor(public dataSource: DataSourceService, private router: Router) {}

  ngAfterViewInit(): void {
    if (this.isInit === false) {
      this.initMap();
    }
  }

  public centerMap() {
    this.map!.setView([this.origY, this.origX], this.origZoom);
  }

  public showLocation(index: number) {
    let y = 0;
    let x = 0;

    switch (index) {
      case 5:
        {
          x = 2092;
          y = -8610;
        }
        break;
      case 4:
        {
          x = 3422;
          y = -6896;
        }
        break;
      case 3:
        {
          x = 17;
          y = -6118;
        }
        break;
      case 2:
        {
          x = 1658;
          y = -6252;
        }
        break;
      case 1:
        {
          x = 2411;
          y = -6011;
        }
        break;

      case 0:
      default:
        {
          x = 3473;
          y = -5126;
        }
        break;
    }

    this.map!.setView([y, x], -1);
  }
}
