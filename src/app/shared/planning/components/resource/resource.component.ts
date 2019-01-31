import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Resource } from '../../models/resource.model';
import { SchedulerConfig } from '../../models/scheduler-config.model';

@Component({
    selector: 'slb-resource',
    templateUrl: './resource.component.html',
    styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {

    @Input() resource: Resource;
    @Input() fieldNames: Partial<Resource>;
    @Input() config: SchedulerConfig;
    @Input() dates: Date[];

    @HostBinding('style.width')
    public get width(): string {
        return this.config.resourceColumnWidth * 100 / (this.dates.length + 1) + '%';
    }

    constructor() { }

    ngOnInit() {
    }
}
