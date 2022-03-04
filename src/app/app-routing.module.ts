import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { PuzzleViewComponent } from './puzzle-view/puzzle-view.component';

const routes: Routes = [
  { path: 'puzzle/:puzzleId', component: PuzzleViewComponent },
  { path: 'map', component: MapComponent },
  { path: '', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
