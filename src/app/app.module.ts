import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { PuzzleViewComponent } from './puzzle-view/puzzle-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThreeDViewComponent } from './three-dview/three-dview.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    PuzzleViewComponent,
    ThreeDViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
