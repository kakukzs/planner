import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { SchedulerService } from '../../services/scheduler.service';
import { Resource } from '../../models/resource.model';
import { SchedulerEvent } from '../../models/scheduler-event.model';
import { SchedulerConfig } from '../../models/scheduler-config.model';

@Component({
    selector: 'slb-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements OnInit {
    @Input() events = [];
    @Input() resources: Resource[] = [];
    @Input() lists: string[] = [];

    config: SchedulerConfig;
    dates: Date[];

    constructor(private schedulerService: SchedulerService) { }

    ngOnInit() {
        this.schedulerService.getConfigObservable().subscribe((config: SchedulerConfig) => {
            this.dates = this.schedulerService.getDates(config.start, config.firstDayOfWeek, config.lengthOfWeek, config.numberOfWeeks);
        });
    }

    onConfigChanged(newConfig: SchedulerConfig) {
        this.schedulerService.updateConfig(newConfig);
    }

    drop(event: CdkDragDrop<SchedulerEvent[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }
}
