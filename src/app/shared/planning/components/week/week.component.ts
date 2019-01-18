import { Component, OnInit, Input, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { dayCodes } from '../../models/day.model';
import { Event } from '../../models/event.model';
import { Resource } from '../../models/resource.model';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'slb-week',
  templateUrl: './week.component.html',
  styleUrls: ['./week.component.scss']
})
export class WeekComponent implements OnInit, AfterViewInit {

  @Input() startDate: Date;
  @Input() firstDayOfWeek: dayCodes;
  @Input() lengthOfWeek: number;
  @Input() numberOfWeeks: number;
  @Input() resource: Resource;
  @Input() events: Event[];

  myEvents: Map<{ date: number, month: number, year: number }, Event[]> = new Map();

  dates: Array<{ date: number, month: number, year: number }>;
  dayWidth: String;
  dayWidthInner: String;
  eventListWidth: String;

  id: String;

  connectedLists = [];

  @ViewChildren('eventList')
  eventListRefArr: QueryList<ElementRef>;

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.dates = this.dateService.getDates(this.startDate, this.firstDayOfWeek, this.lengthOfWeek, this.numberOfWeeks);
    this.dayWidth = `${100 / (this.dates.length + 1)}%`;
    this.dayWidthInner = `${100 / this.dates.length}%`;
    this.eventListWidth = `${100 - 100 / (this.dates.length + 1)}%`;
    this.id = `week-droplist-${this.resource.id}`;
    for (let i = 0; i < this.dates.length; i++) {
      this.myEvents.set(this.dates[i], this.filterMyEvents(this.dates[i]));
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      for (let i = 0; i < this.dates.length; i++) {
        this.connectedLists.push(this.eventListRefArr
          .filter((item: ElementRef, idx) => i !== idx)
          .map((value: ElementRef) => value));
      }
    });
  }

  filterMyEvents(dateInfo: { date: number, month: number, year: number }): Event[] {
    const events = this.events.filter((event: Event) => {
      return event.resourceId === this.resource.id
        && event.startDate.getFullYear() === dateInfo.year
        && event.startDate.getMonth() === dateInfo.month
        && event.startDate.getDate() === dateInfo.date;
    });
    return events;
  }

  getMyEvents(dateInfo: { date: number, month: number, year: number }): Event[] {
    return this.myEvents.get(dateInfo);
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
