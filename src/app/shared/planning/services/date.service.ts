import { Injectable } from '@angular/core';
import { PlanningModule } from '../planning.module';
import { dayCodes } from '../models/day.model';

export class DateService {

  constructor() { }

  private _getDates(startDate: Date, firstDayOfWeek: dayCodes, lengthOfWeek: number): Array<{ date: number, month: number, year: number }> {
    const dateInfo: Array<{ date: number, month: number, year: number }> = [];
    let fromDate: Date = startDate;
    while (dayCodes[fromDate.getDay()] !== dayCodes[firstDayOfWeek]) {
      fromDate = new Date(fromDate);
      fromDate.setDate(fromDate.getDate() - 1);
    }
    for (let i = 0; i < lengthOfWeek; i++) {
      dateInfo.push({
        date: fromDate.getDate(),
        month: fromDate.getMonth(),
        year: fromDate.getFullYear()
      });
      fromDate.setDate(fromDate.getDate() + 1);
    }
    return dateInfo;
  }

  public getDates(startDate: Date, firstDayOfWeek: dayCodes, lengthOfWeek: number, numberOfWeeks: number = 1): Array<{ date: number, month: number, year: number }> {
    let dates: Array<{ date: number, month: number, year: number }> = [];
    for (let i = 0; i < numberOfWeeks; i++) {
      let date = new Date(startDate);
      date.setDate(date.getDate() + i * 7);
      dates = dates.concat(this._getDates(date, firstDayOfWeek, lengthOfWeek));
    }
    return dates;
  }
}
