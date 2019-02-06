import { Component, OnInit } from '@angular/core';

import { Resource } from '../../models/resource.model';
import { products } from './products';
import { SchedulerEvent, SchedulerEventRect } from '../../models/scheduler-event.model';
import { SchedulerService } from '../../services/scheduler.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragStart, CdkDragMove } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';
import { DragAndDropService } from '../../services/drag-and-drop.service';

@Component({
    selector: 'app-planning-home',
    templateUrl: './planning-home.component.html',
    styleUrls: ['./planning-home.component.scss']
})
export class PlanningHomeComponent implements OnInit {

    gridData: any[] = products;

    dates: Date[];

    events$: BehaviorSubject<SchedulerEvent[]>;

    test = [{
        title: 'test1',
        start: (function () {
            const d = new Date(); d.setHours(10); d.setMinutes(0);
            d.setSeconds(0); return d;
        }()),
        end: (function () {
            const d = new Date(); d.setHours(16); d.setMinutes(0);
            d.setSeconds(0); return d;
        }()),
        OwnerID: 1
    }, {
        title: 'test2',
        start: (function () {
            const d = new Date(); d.setHours(10); d.setMinutes(0);
            d.setSeconds(0); return d;
        }()),
        end: (function () {
            const d = new Date(); d.setHours(16); d.setMinutes(0);
            d.setSeconds(0); return d;
        }()),
        OwnerID: 1
    }];

    public resources: Resource[] = [{
        name: 'Bays',
        data: [
            { text: 'Resource 001', value: 1, color: 'orange' },
            { text: 'Resource 002', value: 2, color: 'pink' },
            { text: 'Resource 003', value: 3, color: 'cyan' },
            { text: 'Resource 004', value: 4, color: 'lightblue' },
        ],
        field: 'roomId',
        valueField: 'value',
        textField: 'text',
        colorField: 'color'
    }];

    public kendoGroup: any = {
        resources: ['Bays'],
        orientation: 'vertical'
    };

    constructor(private schedulerService: SchedulerService, private dragAndDropService: DragAndDropService) {
        this.events$ = this.schedulerService.getEventsObservable();
    }

    ngOnInit() {
        this.schedulerService.getDatesObservable().subscribe((dates: Date[]) => {
            this.dates = dates;
        });
    }

    getDroplistIds(): string[] {
        const lists = [];
        for (const resourceGroup of this.resources) {
            for (const resource of resourceGroup.data) {
                lists.push(`droplist-${resource[resourceGroup.valueField]}`);
            }
        }
        /*for (let i = 0; i < this.gridData.length; i++) {
            lists.push(`category-tags-2-${i}`);
        }*/
        return lists;
    }

    createEvents(titles: any[]): SchedulerEvent[] {
        return titles.map(object => ({
            title: object.name,
            start: (function () {
                const d = new Date(); d.setHours(10); d.setMinutes(0);
                d.setSeconds(0); return d;
            }()),
            end: (function () {
                const d = new Date(); d.setHours(16); d.setMinutes(0);
                d.setSeconds(0); return d;
            }()),
            OwnerID: 1
        }));
    }

    getEventOffset(event: SchedulerEvent, addOffset: boolean = false): SchedulerEventRect {
        return {
            left: 0,
            width: 100
        };
    }

    mousedown(event: MouseEvent) {
        this.dragAndDropService.mousedown(event);
    }

    dragStarted(dragStart: CdkDragStart<SchedulerEvent>) {
        this.dragAndDropService.dragStarted(dragStart);
        //this.schedulerService.addEvent(dragStart.source.data);
    }

    dragMoved(dragMove: CdkDragMove) {
        this.dragAndDropService.dragMoved(dragMove);
    }

    dragDropped(dragDrop: CdkDragDrop<SchedulerEvent>) {
        this.dragAndDropService.dragDropped(dragDrop);
    }

    isEventHolderRegistered(): boolean {
        return this.dragAndDropService.isEventHolderRegistered();
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
