import { Component, Input, ElementRef, OnChanges, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';
import { CdkDragDrop, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

import { Resource } from '../../../models/resource.model';
import { SchedulerService } from '../../../services/scheduler.service';
import { SchedulerEvent, SchedulerEventRect } from '../../../models/scheduler-event.model';
import { SchedulerConfig } from '../../../models/scheduler-config.model';


@Component({
    selector: 'slb-scheduler-row',
    templateUrl: './scheduler-row.component.html',
    styleUrls: ['./scheduler-row.component.scss']
})
export class SchedulerRowComponent implements OnChanges {

    static draggedEvent: SchedulerEvent;
    static draggedEventOffset: SchedulerEventRect;
    static draggedEventStart: Date;

    @Input() dates: Date[];
    @Input() resource: Resource;
    @Input() events: SchedulerEvent[];
    @Input() fieldNames: Partial<Resource>;
    @Input() lists: string[] = [];
    @Input() config: SchedulerConfig;

    @Output() eventChanged: EventEmitter<{ oldEvent: SchedulerEvent, newEvent: SchedulerEvent }>;

    @ViewChild('eventHolder') eventHolder: ElementRef;

    myEvents: Map<Date, SchedulerEvent[]> = new Map();

    id: String;
    origX: number;
    deltaOffsetX = 0;


    constructor(private schedulerService: SchedulerService, private renderer: Renderer2) {
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

    drop(event: CdkDragDrop<number>) {
        const droplistData = event.container.data;
        const schedulerEvent: SchedulerEvent = event.item.data;
        const start = SchedulerRowComponent.draggedEventStart;
        const end = new Date();
        end.setTime(SchedulerRowComponent.draggedEventStart.getTime() + Math.max(0,
            schedulerEvent.end.getTime() - schedulerEvent.start.getTime()));
        this.eventChanged.emit({
            oldEvent: schedulerEvent,
            newEvent: {
                ...schedulerEvent,
                OwnerID: droplistData,
                start,
                end
            }
        });
        SchedulerRowComponent.draggedEvent = null;
        SchedulerRowComponent.draggedEventStart = null;
    }

    getEventOffset(event: SchedulerEvent, addOffset: boolean = false): SchedulerEventRect {
        const startDate = this.dates.find((d: Date) => d.getFullYear() === event.start.getFullYear()
            && d.getMonth() === event.start.getMonth() && d.getDate() === event.start.getDate());
        const endDate = this.dates.find((d: Date) => d.getFullYear() === event.end.getFullYear()
            && d.getMonth() === event.end.getMonth() && d.getDate() === event.end.getDate());

        if (!startDate && !endDate) {
            return { left: 0, width: 1 };
        }
        // TODO: Implement the case if some of the dates (start/end) are out of view
        // TODO: handle the case when the end or start date is cut by business hours ending

        const eventStartTime = event.start.getHours() * 60 + event.start.getMinutes();
        const eventEndTime = event.end.getHours() * 60 + event.end.getMinutes();
        const configStartTime = this.config.startTime.getHours() * 60 + this.config.startTime.getMinutes();
        const configTimeRange = this.getConfigTimeRange();

        const offsetStart = this.dates.indexOf(startDate) / this.dates.length;
        const dayOffsetStart = Math.max(Math.min(eventStartTime - configStartTime, configTimeRange), 0) / configTimeRange;

        const offsetEnd = this.dates.indexOf(endDate) / this.dates.length;
        const dayOffsetEnd = Math.max(Math.min(eventEndTime - configStartTime, configTimeRange), 0) / configTimeRange;

        const left = (offsetStart + dayOffsetStart / this.dates.length) * 100 + (addOffset ? this.deltaOffsetX : 0);
        const right = (offsetEnd + dayOffsetEnd / this.dates.length) * 100 + (addOffset ? this.deltaOffsetX : 0);

        return {
            left,
            width: right - left
        };
    }

    getConfigTimeRange(): number {
        const range = (this.config.endTime.getTime() - this.config.startTime.getTime()) / 60000;
        return range
            + this.config.endTime.getHours() * 60 + this.config.endTime.getMinutes()
            - this.config.startTime.getHours() * 60 - this.config.startTime.getMinutes();
    }

    mousedown(event: MouseEvent) {
        this.origX = event.clientX;
    }

    dragStarted(dragStart: CdkDragStart<SchedulerEvent>) {
        SchedulerRowComponent.draggedEvent = dragStart.source.data;
        SchedulerRowComponent.draggedEventStart = new Date(SchedulerRowComponent.draggedEvent.start);
        SchedulerRowComponent.draggedEventOffset = this.getEventOffset(SchedulerRowComponent.draggedEvent);
    }

    dragMoved(dragMove: CdkDragMove) {
        const eventHolderWidth = this.eventHolder.nativeElement.clientWidth;
        const dayWidth = eventHolderWidth / this.dates.length;
        const timeRange = this.getConfigTimeRange();
        const timeStepWidth = (dayWidth / (timeRange / this.config.timeStep)) / eventHolderWidth * 100;
        const deltaX = (dragMove.pointerPosition.x - this.origX) / eventHolderWidth * 100;
        const exactTime = SchedulerRowComponent.draggedEventOffset.left + deltaX;
        const approxTime1 = Math.floor(exactTime / timeStepWidth) * timeStepWidth;
        const approxTime2 = Math.floor(exactTime / timeStepWidth) * timeStepWidth + timeStepWidth;
        let approxTime: number;
        if (Math.abs(exactTime - approxTime1) < Math.abs(exactTime - approxTime2)) {
            approxTime = Math.min(100, Math.max(0, approxTime1));
        } else {
            approxTime = Math.min(100, Math.max(0, approxTime2));
        }
        const eventNewPosition = eventHolderWidth * approxTime / 100;
        const eventNewDateIndex = Math.min(this.dates.length - 1, Math.max(0, Math.floor(eventNewPosition / dayWidth)));
        this.deltaOffsetX = approxTime - SchedulerRowComponent.draggedEventOffset.left;

        const eventNewTimePosition = eventNewPosition - eventNewDateIndex * dayWidth;
        const configStartTime = this.config.startTime.getHours() * 60 + this.config.startTime.getMinutes();
        const eventNewExactTime = configStartTime + timeRange * eventNewTimePosition / dayWidth;
        const eventNewApproxTime1 = Math.floor(eventNewExactTime / timeStepWidth) * timeStepWidth;
        const eventNewApproxTime2 = Math.floor(eventNewExactTime / timeStepWidth) * timeStepWidth + timeStepWidth;
        let eventNewApproxTime: number;
        if (Math.abs(eventNewExactTime - eventNewApproxTime1) < Math.abs(eventNewExactTime - eventNewApproxTime2)) {
            eventNewApproxTime = eventNewApproxTime1;
        } else {
            eventNewApproxTime = eventNewApproxTime2;
        }
        SchedulerRowComponent.draggedEventStart.setTime(this.dates[eventNewDateIndex].getTime());
        SchedulerRowComponent.draggedEventStart.setHours(Math.floor(eventNewApproxTime / 60));
        SchedulerRowComponent.draggedEventStart.setMinutes(eventNewApproxTime % 60);
    }

    dragDropped(dragDrop: CdkDragDrop<SchedulerEvent>) {
        this.deltaOffsetX = 0;
    }
}
