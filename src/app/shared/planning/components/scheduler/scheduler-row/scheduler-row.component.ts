import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, OnChanges, Output, EventEmitter } from '@angular/core';
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
    @Input() config: SchedulerConfig;

    @Output() eventChanged: EventEmitter<{ oldEvent: SchedulerEvent, newEvent: SchedulerEvent }>;

    myEvents: Map<Date, SchedulerEvent[]> = new Map();
    dayWidth: String;
    dayWidthInner: String;
    eventListWidth: String;

    id: String;

    @ViewChildren('eventList')
    eventListRefArr: QueryList<ElementRef>;

    constructor(private schedulerService: SchedulerService) {
        this.eventChanged = new EventEmitter<{ oldEvent: SchedulerEvent, newEvent: SchedulerEvent }>();
    }

    ngOnChanges() {
        if (this.dates) {
            this.id = `scheduler-row-droplist-${this.resource[this.fieldNames.valueField]}`;
            for (let i = 0; i < this.dates.length; i++) {
                this.myEvents.set(this.dates[i], this.filterMyEvents(this.dates[i]));
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
        return this.myEvents.get(date);
    }

    drop(event: CdkDragDrop<[Date, number]>) {
        const droplistData = event.container.data;
        const schedulerEvent: SchedulerEvent = event.item.data;
        const end = new Date();
        end.setTime(droplistData[0].getTime() + schedulerEvent.end.getTime() - schedulerEvent.start.getTime());
        this.eventChanged.emit({
            oldEvent: schedulerEvent,
            newEvent: {
                ...schedulerEvent,
                OwnerID: droplistData[1],
                start: droplistData[0],
                end
            }
        });
    }
}
