import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { PuzzleListingComponent } from './puzzle-listing/puzzle-listing.component';
import { PuzzleViewComponent } from './puzzle-view/puzzle-view.component';

const routes: Routes = [
  { path: 'puzzle/:puzzleId', component: PuzzleViewComponent },
  { path: 'list/:island', component: PuzzleListingComponent },
  { path: 'map', component: MapComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
