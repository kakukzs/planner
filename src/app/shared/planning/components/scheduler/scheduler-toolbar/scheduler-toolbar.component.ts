import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SchedulerConfig } from '../../../models/scheduler-config.model';

@Component({
    selector: 'slb-scheduler-toolbar',
    templateUrl: './scheduler-toolbar.component.html',
    styleUrls: ['./scheduler-toolbar.component.scss']
})
export class SchedulerToolbarComponent implements OnInit {
    private viewIndex: number;

    @Input() schedulerViews: SchedulerConfig[];
    @Output() configChanged: EventEmitter<SchedulerConfig>;

    constructor() {
        this.configChanged = new EventEmitter<SchedulerConfig>();
    }

    ngOnInit() {
    }

    onConfigChage() {
        this.configChanged.emit(this.schedulerViews[this.viewIndex]);
    }
}
