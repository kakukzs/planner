import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { Event } from '../../models/event.model';
import { dayCodes } from '../../models/day.model';

@Component({
  selector: 'slb-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit, OnDestroy {

  @Input() date: number;
  @Input() month: number;
  @Input() year: number;

  @Input() resourceId: number;
  @Input() events: Event[];

  amEvents: Event[] = [];
  pmEvents: Event[] = [];

  ellapsedFromToday: String;
  intervalIDForEllapsedFromToday: any;

  constructor() { }

  ngOnInit() {
    this.amEvents = this.getEvents();
    this.pmEvents = this.getEvents(false);
    this.ellapsedFromToday = this.getEllapsedFromToday();
    this.intervalIDForEllapsedFromToday = setInterval(() => {
      this.ellapsedFromToday = this.getEllapsedFromToday();
    }, 300000);
    this.isWeekend();
  }

  ngOnDestroy() {
    clearInterval(this.intervalIDForEllapsedFromToday);
  }

  getEllapsedFromToday(): String {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return `${100 * minutes / (24 * 60)}%`;
  }

  getEvents(isAM: boolean = true): Event[] {
    const events = this.events.filter((event: Event) => {
      return event.resourceId === this.resourceId
        && this.date === event.startDate.getDate()
        && this.month === event.startDate.getMonth()
        && (isAM ? (event.startDate.getHours() < 12) : (event.startDate.getHours() >= 12));
    });
    return events;
  }

  isToday() {
    const today = new Date();
    return today.getFullYear() === this.year
      && today.getMonth() === this.month
      && today.getDate() === this.date;
  }

  isWeekend() {
    const date: Date = new Date();
    date.setDate(this.date);
    date.setMonth(this.month);
    date.setFullYear(this.year);
    return date.getDay() < 1 || date.getDay() > 5;
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
