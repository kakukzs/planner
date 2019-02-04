import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { SchedulerEvent, SchedulerEventRect } from '../../../models/scheduler-event.model';

@Component({
    selector: 'slb-scheduler-event',
    templateUrl: './scheduler-event.component.html',
    styleUrls: ['./scheduler-event.component.scss']
})
export class SchedulerEventComponent implements OnInit {

    @Input() event: SchedulerEvent;
    @Input() offset: SchedulerEventRect;

    @HostBinding('style.left')
    public get left(): string {
        return this.offset ? (this.offset.left + (this.offset.isPercentage ? '%' : 'px')) : '0';
    }

    @HostBinding('style.width')
    public get width(): string {
        return this.offset ? (this.offset.width + (this.offset.isPercentage ? '%' : 'px')) : '0';
    }

    constructor() { }

    ngOnInit() {
    }
}
