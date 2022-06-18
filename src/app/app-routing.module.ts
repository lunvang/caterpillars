import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircleComponent } from './circle/circle.component';
import { CirclesComponent } from './circles/circles.component';
import { RadarComponent } from './radar/radar.component';

const defaultGame = "circles";

const routes: Routes = [
  { path: "circle", component: CircleComponent },
  { path: "circles", component: CirclesComponent },
  { path: "radar", component: RadarComponent },
  { path: "**", redirectTo: defaultGame }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
