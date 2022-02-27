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
} from '@fortawesome/free-solid-svg-icons';
//import { faSquare as farSquare, faCheckSquare as farCheckSquare } from '@fortawesome/free-regular-svg-icons';

import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { PuzzleConfigurationComponent } from './puzzle-configuration/puzzle-configuration.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    PuzzleViewComponent,
    ThreeDViewComponent,
    PuzzleConfigurationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
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
      faInfoCircle
    );
  }
}
