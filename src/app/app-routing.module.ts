import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CircleComponent } from './circle/circle.component';
import { CirclesComponent } from './circles/circles.component';

const routes: Routes = [
  { path: "circle", component: CircleComponent },
  { path: "circles", component: CirclesComponent },
  { path: "**", redirectTo: "circle" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
