import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { SchedulerService } from '../../services/scheduler.service';
import { Resource } from '../../models/resource.model';
import { SchedulerEvent } from '../../models/scheduler-event.model';
import { SchedulerConfig } from '../../models/scheduler-config.model';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'slb-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulerComponent implements OnInit, OnDestroy {
    @Input() events = [];
    @Input() resources: Resource[] = [];
    @Input() lists: string[] = [];

    config$: BehaviorSubject<SchedulerConfig>;
    configSubscription: Subscription;
    schedulerViews: SchedulerConfig[];
    dates: Date[];

    constructor(private schedulerService: SchedulerService) {
        this.schedulerViews = this.schedulerService.getSchedulerViews();
    }

    ngOnInit() {
        this.config$ = this.schedulerService.getConfigObservable();
        this.configSubscription = this.config$.subscribe((config: SchedulerConfig) => {
            this.dates = this.schedulerService.getDates(config.start, config.firstDayOfWeek, config.lengthOfWeek, config.numberOfWeeks);
        });
    }

    ngOnDestroy() {
        this.configSubscription.unsubscribe();
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

    eventChanged(event: { oldEvent: SchedulerEvent, newEvent: SchedulerEvent }) {
        this.schedulerService.updateEvent(event.oldEvent, event.newEvent);
    }
}
