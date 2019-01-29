import { Component, OnInit } from '@angular/core';

import { Resource } from '../../models/resource.model';
import { products } from './products';
import { SchedulerEvent } from '../../models/scheduler-event.model';
import { SchedulerService } from '../../services/scheduler.service';
import { SchedulerConfig } from '../../models/scheduler-config.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-planning-home',
    templateUrl: './planning-home.component.html',
    styleUrls: ['./planning-home.component.scss']
})
export class PlanningHomeComponent implements OnInit {

    gridData: any[] = products;

    dates: Date[];

    events$: BehaviorSubject<SchedulerEvent[]>;

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

    constructor(private schedulerService: SchedulerService) {
        this.events$ = this.schedulerService.getEventsObservable();
    }

    ngOnInit() {
        this.schedulerService.getConfigObservable().subscribe((config: SchedulerConfig) => {
            this.dates = this.schedulerService.getDates(config.start, config.firstDayOfWeek, config.lengthOfWeek, config.numberOfWeeks);
        });
    }

    getDroplistIds(): string[] {
        const lists = [];
        for (let i = 0; i < this.dates.length; i++) {
            for (const resourceGroup of this.resources) {
                for (const resource of resourceGroup.data) {
                    lists.push(`droplist-${resource[resourceGroup.valueField]}-${i}`);
                }
            }
        }
        for (let i = 0; i < this.gridData.length; i++) {
            lists.push(`category-tags-2-${i}`);
        }
        return lists;
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
