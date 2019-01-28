import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SchedulerConfig, schedulerViews } from '../../../models/scheduler-config.model';

@Component({
    selector: 'slb-scheduler-toolbar',
    templateUrl: './scheduler-toolbar.component.html',
    styleUrls: ['./scheduler-toolbar.component.scss']
})
export class SchedulerToolbarComponent implements OnInit {
    private schedulerViews: SchedulerConfig[];
    private viewIndex: number;

    @Output() configChanged: EventEmitter<SchedulerConfig>;

    constructor() {
        this.schedulerViews = schedulerViews;
        this.configChanged = new EventEmitter<SchedulerConfig>();
    }

    ngOnInit() {
    }

    onConfigChage() {
        this.configChanged.emit(this.schedulerViews[this.viewIndex]);
    }
}
