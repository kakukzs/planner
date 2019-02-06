import { Component, Input, ElementRef, OnChanges, Output, EventEmitter, ViewChild, Renderer2, OnInit } from '@angular/core';
import { CdkDragDrop, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

import { Resource } from '../../../models/resource.model';
import { SchedulerService } from '../../../services/scheduler.service';
import { SchedulerEvent, SchedulerEventRect } from '../../../models/scheduler-event.model';
import { SchedulerConfig } from '../../../models/scheduler-config.model';
import { DragAndDropService } from '../../../services/drag-and-drop.service';


@Component({
    selector: 'slb-scheduler-row',
    templateUrl: './scheduler-row.component.html',
    styleUrls: ['./scheduler-row.component.scss']
})
export class SchedulerRowComponent implements OnChanges, OnInit {

    @Input() dates: Date[];
    @Input() resource: Resource;
    @Input() events: SchedulerEvent[];
    @Input() fieldNames: Partial<Resource>;
    @Input() lists: string[] = [];
    @Input() config: SchedulerConfig;

    @Output() eventChanged: EventEmitter<{ oldEvent: SchedulerEvent, newEvent: SchedulerEvent }>;
    @Output() newEvent: EventEmitter<SchedulerEvent>;

    @ViewChild('eventHolder') eventHolder: ElementRef;

    myEvents: Map<Date, SchedulerEvent[]> = new Map();

    id: String;

    constructor(
        private schedulerService: SchedulerService,
        private dragAndDropService: DragAndDropService,
        private renderer: Renderer2) {
        this.eventChanged = new EventEmitter<{ oldEvent: SchedulerEvent, newEvent: SchedulerEvent }>();
        this.newEvent = new EventEmitter<SchedulerEvent>();
    }

    ngOnChanges() {
        if (this.dates) {
            this.id = `scheduler-row-droplist-${this.resource[this.fieldNames.valueField]}`;
            for (let i = 0; i < this.dates.length; i++) {
                this.myEvents.set(this.dates[i], this.filterMyEvents(this.dates[i]));
            }
        }
    }

    ngOnInit() {
        this.dragAndDropService.registerEventHolderElement(this.eventHolder);
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

    drop(event: CdkDragDrop<number>) {
        const droplistData = event.container.data;
        const schedulerEvent: SchedulerEvent = event.item.data;
        if (schedulerEvent) {
            if (this.events.includes(schedulerEvent)) {
                this.eventChanged.emit(this.dragAndDropService.existingEventDropped(schedulerEvent, droplistData));
            } else {
                schedulerEvent.OwnerID = droplistData;
                this.newEvent.emit(this.dragAndDropService.newEventDropped(schedulerEvent));
            }
        }
    }

    getEventOffset(event: SchedulerEvent, addOffset: boolean = false): SchedulerEventRect {
        return this.dragAndDropService.getEventOffset(event, addOffset);
    }

    mousedown(event: MouseEvent) {
        this.dragAndDropService.mousedown(event);
    }

    dragStarted(dragStart: CdkDragStart<SchedulerEvent>) {
        this.dragAndDropService.dragStarted(dragStart);
    }

    dragMoved(dragMove: CdkDragMove) {
        this.dragAndDropService.dragMoved(dragMove);
    }

    dragDropped(dragDrop: CdkDragDrop<SchedulerEvent>) {
        this.dragAndDropService.dragDropped(dragDrop);
    }
}
