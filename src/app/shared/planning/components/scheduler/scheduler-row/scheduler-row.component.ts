import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, OnChanges } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Resource } from '../../../models/resource.model';
import { SchedulerService } from '../../../services/scheduler.service';
import { SchedulerEvent } from '../../../models/scheduler-event.model';
import { SchedulerConfig } from '../../../models/scheduler-config.model';


@Component({
    selector: 'slb-scheduler-row',
    templateUrl: './scheduler-row.component.html',
    styleUrls: ['./scheduler-row.component.scss']
})
export class SchedulerRowComponent implements OnChanges {

    @Input() dates: Date[];
    @Input() resource: Resource;
    @Input() events: SchedulerEvent[];
    @Input() fieldNames: Partial<Resource>;
    @Input() lists: string[] = [];

    myEvents: Object = {};
    dayWidth: String;
    dayWidthInner: String;
    eventListWidth: String;

    id: String;

    @ViewChildren('eventList')
    eventListRefArr: QueryList<ElementRef>;

    constructor(private schedulerService: SchedulerService) { }

    ngOnChanges() {
        if (this.dates) {
            this.dayWidth = `${100 / (this.dates.length + 1)}%`;
            this.dayWidthInner = `${100 / this.dates.length}%`;
            this.eventListWidth = `${100 - 100 / (this.dates.length + 1)}%`;
            this.id = `scheduler-row-droplist-${this.resource[this.fieldNames.valueField]}`;
            for (let i = 0; i < this.dates.length; i++) {
                this.myEvents[String(this.dates[i])] = this.filterMyEvents(this.dates[i]);
            }
        }
    }

    filterMyEvents(date: Date): SchedulerEvent[] {
        const events = this.events.filter((event: SchedulerEvent) => {
            return event.OwnerID === this.resource[this.fieldNames.valueField]
                && event.start.getFullYear() === date.getFullYear()
                && event.start.getMonth() === date.getMonth()
                && event.start.getDate() === date.getDate();
        });
        return events;
    }

    getMyEvents(date: Date): SchedulerEvent[] {
        return this.myEvents[String(date)];
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
