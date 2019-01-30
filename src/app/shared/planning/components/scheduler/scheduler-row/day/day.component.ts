import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { SchedulerService } from 'src/app/shared/planning/services/scheduler.service';
import { SchedulerConfig } from 'src/app/shared/planning/models/scheduler-config.model';

@Component({
    selector: 'slb-day',
    templateUrl: './day.component.html',
    styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit, OnDestroy {

    @Input() date: Date; // the date that this component represent

    @Input()
    set config(newConfig: SchedulerConfig) {
        if (newConfig.timeSlots !== undefined && newConfig.startTime !== undefined && newConfig.endTime !== undefined) {
            const startTS = newConfig.startTime.getTime();
            const endTS = newConfig.endTime.getTime();
            if (newConfig.timeSlots > 0 && endTS > startTS) {
                const timeRange = endTS - startTS;
                this.timeArray = [];
                for (let i = 0, inc = timeRange / newConfig.timeSlots; i < newConfig.timeSlots; i++) {
                    const date = new Date();
                    date.setTime(startTS + inc * i);
                    this.timeArray.push(date);
                }
            }
        }
    }
    timeArray: Date[] = [];
    ellapsedFromToday: String;
    intervalIDForEllapsedFromToday: any;

    constructor(private schedulerService: SchedulerService) { }

    ngOnInit() {
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

    isToday() {
        const today = new Date();
        return today.getFullYear() === this.date.getFullYear()
            && today.getMonth() === this.date.getMonth()
            && today.getDate() === this.date.getDate();
    }

    isWeekend() {
        const date: Date = new Date();
        date.setTime(this.date.getTime());
        return date.getDay() < 1 || date.getDay() > 5;
    }
}
