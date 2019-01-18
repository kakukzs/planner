import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';


import { dayCodes } from '../../models/day.model';
import { Event } from '../../models/event.model';
import { Resource } from '../../models/resource.model';
import { DateService } from '../../services/date.service';

import {
  GridDataResult,
  PageChangeEvent
} from '@progress/kendo-angular-grid';

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

  public data: any[] = [];



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

  constructor() {
    this.data = this.createRandomData(100000);
  }

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


  // ---------------
  private createRandomData(count: number): any[] {
    const firstNames = ['18-Jan-2012 05:30','20-Jan-2012 05:30','15-Mar-2012 15:30','20-Jul-2014 05:30','1-Jan-2018 05:30','11-Feb-2014 05:30','14-Sep-2012 12:13'],
        lastNames = [],
        cities = ['11RCB0240-0300-3-800', '11RCB0240-0300-3-797','11RCB0240-0300-3-243','11RCB0240-0300-3-324'],
        titles = ['COLLARS', 'RESISTIVITY', 'DMHV MATERIALS AND SUPPLIES', 'SUBS', 'SLIMPULSE'];

    return Array(count).fill({}).map((_, idx) => ({
        id: idx + 1,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
        title: titles[Math.floor(Math.random() * titles.length)]
    })
    );
}
}