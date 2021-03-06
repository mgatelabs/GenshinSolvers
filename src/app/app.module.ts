import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { PuzzleViewComponent } from './puzzle-view/puzzle-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThreeDViewComponent } from './three-dview/three-dview.component';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

import {
  faDirections,
  faEye,
  faArrowAltCircleUp,
  faArrowAltCircleRight,
  faArrowAltCircleDown,
  faArrowAltCircleLeft,
  faAngleLeft,
  faAngleRight,
  faInfoCircle,
  faPlayCircle,
  faSync,
  faCog,
  faFlagCheckered,
  faMapSigns,
} from '@fortawesome/free-solid-svg-icons';
//import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { PuzzleConfigurationComponent } from './puzzle-configuration/puzzle-configuration.component';
import { PuzzleSolutionComponent } from './puzzle-solution/puzzle-solution.component';
import { HomeComponent } from './home/home.component';
import { PuzzleListingComponent } from './puzzle-listing/puzzle-listing.component';
import { MapKeyComponent } from './map-key/map-key.component';
import { OldChouTreasureComponent } from './old-chou-treasure/old-chou-treasure.component';
import { OldChouTreasureButtonComponent } from './old-chou-treasure-button/old-chou-treasure-button.component';
import { OldChouTreasureRowComponent } from './old-chou-treasure-row/old-chou-treasure-row.component';
import { OldChouTreasureAreaComponent } from './old-chou-treasure-area/old-chou-treasure-area.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    PuzzleViewComponent,
    ThreeDViewComponent,
    PuzzleConfigurationComponent,
    PuzzleSolutionComponent,
    HomeComponent,
    PuzzleListingComponent,
    MapKeyComponent,
    OldChouTreasureComponent,
    OldChouTreasureButtonComponent,
    OldChouTreasureRowComponent,
    OldChouTreasureAreaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIcons(
      faGithub,
      faDirections,
      faEye,
      faArrowAltCircleUp,
      faArrowAltCircleRight,
      faArrowAltCircleDown,
      faArrowAltCircleLeft,
      faAngleLeft,
      faAngleRight,
      faInfoCircle,
      faPlayCircle,
      faSync,
      faCog,
      faFlagCheckered,
      faMapSigns
    );
  }
}
