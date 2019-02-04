import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';
import { GridModule } from '@progress/kendo-angular-grid';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';

import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningHomeComponent } from './pages/planning-home/planning-home.component';
import { DayComponent } from './components/scheduler/scheduler-row/day/day.component';
import { SchedulerRowComponent } from './components/scheduler/scheduler-row/scheduler-row.component';
import { ResourceComponent } from './components/resource/resource.component';
import { BoxifyPipe } from './pipes/boxify.pipe';
import { SchedulerHeaderComponent } from './components/scheduler/scheduler-header/scheduler-header.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { SchedulerComponent } from './components/scheduler/scheduler.component';
import { FieldNamesPipe } from './pipes/field-names.pipe';
import { SchedulerService } from './services/scheduler.service';
import { SchedulerToolbarComponent } from './components/scheduler/scheduler-toolbar/scheduler-toolbar.component';
import { FormsModule } from '@angular/forms';
import { SchedulerEventComponent } from './components/scheduler/scheduler-event/scheduler-event.component';
import { EventUIService } from './services/event-ui.service';

@NgModule({
    declarations: [
        PlanningHomeComponent,
        DayComponent,
        ResourceComponent,
        BoxifyPipe,
        SchedulerRowComponent,
        SchedulerHeaderComponent,
        SchedulerComponent,
        FieldNamesPipe,
        SchedulerToolbarComponent,
        SchedulerEventComponent],
    imports: [
        CommonModule,
        DragDropModule,
        FormsModule,
        ResizableModule,
        GridModule,
        SchedulerModule,
        HttpClientModule,
        HttpClientJsonpModule,
        PlanningRoutingModule
    ],
    providers: [SchedulerService, EventUIService]
})
export class PlanningModule { }
