import { Component, OnInit, Input } from '@angular/core';
import { SchedulerConfig } from '../../../models/scheduler-config.model';

@Component({
    selector: 'slb-scheduler-header',
    templateUrl: './scheduler-header.component.html',
    styleUrls: ['./scheduler-header.component.scss']
})
export class SchedulerHeaderComponent implements OnInit {

    @Input() dates: Date[];
    @Input() config: SchedulerConfig;

    constructor() { }

    ngOnInit() { }

    getDateFormat(): string {
        return this.config.headerDateFormat === 'short'
            ? 'MMM d' : this.config.headerDateFormat === 'normal'
                ? 'EEE, MMM d' : 'EEEE, MMMM d';
    }

    getHeaderClass(): string {
        return this.config.headerDateFormat === 'short'
            ? 'small' : this.config.headerDateFormat === 'normal'
                ? 'medium' : 'big';
    }
}
