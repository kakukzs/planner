import { Component, OnInit, Input } from '@angular/core';
import { dayCodes } from '../../models/day.model';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'slb-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent implements OnInit {

  @Input() startDate: Date;
  @Input() firstDayOfWeek: dayCodes;
  @Input() lengthOfWeek: number;
  @Input() numberOfWeeks: number;

  dates: Array<{ date: number, month: number }>;

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.dates = this.dateService.getDates(this.startDate, this.firstDayOfWeek, this.lengthOfWeek, this.numberOfWeeks);
  }

  getDate(day, month, year): Date {
    let date: Date = new Date();
    date.setDate(day);
    date.setMonth(month);
    date.setFullYear(year);
    return date;
  }
}
