import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { SchedulerEvent } from '../../../models/scheduler-event.model';

@Component({
    selector: 'slb-scheduler-event',
    templateUrl: './scheduler-event.component.html',
    styleUrls: ['./scheduler-event.component.scss']
})
export class SchedulerEventComponent implements OnInit {

    @Input() event: SchedulerEvent;

    @Input()
    @HostBinding('style.left')
    offset: string;

    constructor() { }

    ngOnInit() {
    }
}
