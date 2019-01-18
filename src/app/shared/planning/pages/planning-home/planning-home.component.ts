import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


import { dayCodes } from '../../models/day.model';
import { Event } from '../../models/event.model';
import { Resource } from '../../models/resource.model';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-planning-home',
  templateUrl: './planning-home.component.html',
  styleUrls: ['./planning-home.component.scss'],
  providers: [DateService]
})
export class PlanningHomeComponent implements OnInit {

  fromDate: Date = new Date();
  firstDayOfWeek: dayCodes = dayCodes.MO;
  lengthOfWeek: number = 7;
  numberOfWeeks: number = 2;

  resources: Resource[] = [
    { id: 1, name: 'Resource 001', color: 'orange' },
    { id: 2, name: 'Resource 002', color: 'pink' },
    { id: 3, name: 'Resource 003', color: 'cyan' },
    { id: 4, name: 'Resource 004', color: 'lightblue' },
  ];

  events: Event[] = [
    {
      name: 'Meeting with subordinates',
      resourceId: 1,
      length: 30,
      startDate: (function () { const d = new Date(); d.setDate(d.getDate() + 2); return d; }())
    },
    {
      name: 'Testing approach clarification',
      resourceId: 1,
      length: 30,
      startDate: (function () { const d = new Date(); d.setDate(d.getDate() + 2); return d; }())
    },
    {
      name: 'Knowledge share with client',
      resourceId: 4,
      length: 30,
      startDate: (function () { const d = new Date(); d.setDate(d.getDate() - 1); return d; }())
    }
  ];

  constructor() { }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<Event[]>) {
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
