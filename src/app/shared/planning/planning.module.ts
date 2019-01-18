import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';
import { GridModule } from '@progress/kendo-angular-grid';

import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningHomeComponent } from './pages/planning-home/planning-home.component';
import { DayComponent } from './components/day/day.component';
import { WeekComponent } from './components/week/week.component';
import { ResourceComponent } from './components/resource/resource.component';
import { BoxifyPipe } from './pipes/boxify.pipe';
import { CalendarHeaderComponent } from './components/calendar-header/calendar-header.component';

@NgModule({
  declarations: [PlanningHomeComponent, DayComponent, WeekComponent, ResourceComponent, BoxifyPipe, CalendarHeaderComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ResizableModule,
    PlanningRoutingModule,
    GridModule
  ]
})
export class PlanningModule { }
