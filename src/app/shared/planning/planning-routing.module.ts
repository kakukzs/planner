import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanningHomeComponent } from './pages/planning-home/planning-home.component';

const routes: Routes = [
  { path: '', component: PlanningHomeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanningRoutingModule { }
