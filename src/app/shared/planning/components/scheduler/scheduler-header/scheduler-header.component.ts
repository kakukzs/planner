import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'slb-scheduler-header',
    templateUrl: './scheduler-header.component.html',
    styleUrls: ['./scheduler-header.component.scss']
})
export class SchedulerHeaderComponent implements OnInit {

    @Input() dates: Date[];

    constructor() { }

    ngOnInit() {
    }
}
