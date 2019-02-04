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
    dates$: BehaviorSubject<Date[]>;
    configSubscription: Subscription;
    datesSubscription: Subscription;
    schedulerViews: SchedulerConfig[];
    dates: Date[];

    resourceColumnWidth = 1;

    constructor(private schedulerService: SchedulerService) {
        this.schedulerViews = this.schedulerService.getSchedulerViews();
    }

    ngOnInit() {
        this.config$ = this.schedulerService.getConfigObservable();
        this.dates$ = this.schedulerService.getDatesObservable();
        this.configSubscription = this.config$.subscribe((config: SchedulerConfig) => {
            this.resourceColumnWidth = config.resourceColumnWidth;
        });
        this.datesSubscription = this.dates$.subscribe((dates: Date[]) => {
            this.dates = dates;
        });
    }

    ngOnDestroy() {
        this.configSubscription.unsubscribe();
        this.datesSubscription.unsubscribe();
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
