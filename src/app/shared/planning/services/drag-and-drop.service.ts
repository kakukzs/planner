import { SchedulerEvent, SchedulerEventRect } from '../models/scheduler-event.model';
import { ElementRef, Injectable } from '@angular/core';
import { SchedulerConfig } from '../models/scheduler-config.model';
import { SchedulerService } from './scheduler.service';
import { CdkDragDrop, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';

@Injectable()
export class DragAndDropService {
    config: SchedulerConfig;
    dates: Date[];

    deltaOffsetX = 0;
    origX: number;
    eventHolder: ElementRef;

    draggedEvent: SchedulerEvent;
    draggedEventOffset: SchedulerEventRect;
    draggedEventStart: Date;

    constructor(private schedulerService: SchedulerService) {
        this.schedulerService.getConfigObservable().subscribe((config: SchedulerConfig) => {
            this.config = config;
        });
        this.schedulerService.getDatesObservable().subscribe((dates: Date[]) => {
            this.dates = dates;
        });
    }

    getEventOffset(event: SchedulerEvent, addOffset: boolean = false): SchedulerEventRect {
        const startDate = this.dates.find((d: Date) => d.getFullYear() === event.start.getFullYear()
            && d.getMonth() === event.start.getMonth() && d.getDate() === event.start.getDate());
        const endDate = this.dates.find((d: Date) => d.getFullYear() === event.end.getFullYear()
            && d.getMonth() === event.end.getMonth() && d.getDate() === event.end.getDate());

        if (!startDate && !endDate) {
            return { left: 0, width: 1, isPercentage: true };
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
            width: right - left,
            isPercentage: true
        };
    }

    getConfigTimeRange(): number {
        const range = (this.config.endTime.getTime() - this.config.startTime.getTime()) / 60000;
        return range
            + this.config.endTime.getHours() * 60 + this.config.endTime.getMinutes()
            - this.config.startTime.getHours() * 60 - this.config.startTime.getMinutes();
    }

    existingEventDropped(schedulerEvent: SchedulerEvent, toListId: number): { oldEvent: SchedulerEvent, newEvent: SchedulerEvent } {
        const start = this.draggedEventStart;
        const end = new Date();
        end.setTime(this.draggedEventStart.getTime() + Math.max(0,
            schedulerEvent.end.getTime() - schedulerEvent.start.getTime()));
        this.draggedEvent = null;
        this.draggedEventStart = null;
        return {
            oldEvent: schedulerEvent,
            newEvent: {
                ...schedulerEvent,
                OwnerID: toListId,
                start,
                end
            }
        };
    }

    newEventDropped(toListId: number) {

    }

    mousedown(event: MouseEvent) {
        this.origX = event.clientX;
    }

    dragStarted(dragStart: CdkDragStart<SchedulerEvent>) {
        this.draggedEvent = dragStart.source.data;
        this.draggedEventStart = new Date(this.draggedEvent.start);
        this.draggedEventOffset = this.getEventOffset(this.draggedEvent);
    }

    dragMoved(dragMove: CdkDragMove) {
        const eventHolderWidth = this.eventHolder.nativeElement.clientWidth;
        const dayWidth = eventHolderWidth / this.dates.length;
        const timeRange = this.getConfigTimeRange();
        const timeStepWidth = (dayWidth / (timeRange / this.config.timeStep)) / eventHolderWidth * 100;
        const deltaX = (dragMove.pointerPosition.x - this.origX) / eventHolderWidth * 100;
        const exactTime = this.draggedEventOffset.left + deltaX;
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
        this.deltaOffsetX = approxTime - this.draggedEventOffset.left;

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
        this.draggedEventStart.setTime(this.dates[eventNewDateIndex].getTime());
        this.draggedEventStart.setHours(Math.floor(eventNewApproxTime / 60));
        this.draggedEventStart.setMinutes(eventNewApproxTime % 60);
    }

    dragDropped(dragDrop: CdkDragDrop<SchedulerEvent>) {
        this.deltaOffsetX = 0;
    }

    registerEventHolderElement(eventHolder: ElementRef) {
        this.eventHolder = eventHolder;
    }

    isEventHolderRegistered(): boolean {
        return !!this.eventHolder;
    }
}
