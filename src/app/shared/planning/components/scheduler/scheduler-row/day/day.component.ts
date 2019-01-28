import { Component, OnInit, Input, OnDestroy } from '@angular/core';

@Component({
    selector: 'slb-day',
    templateUrl: './day.component.html',
    styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit, OnDestroy {

    @Input() date: Date;

    ellapsedFromToday: String;
    intervalIDForEllapsedFromToday: any;

    constructor() { }

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
        date.setDate(this.date.getDate());
        date.setMonth(this.date.getMonth());
        date.setFullYear(this.date.getFullYear());
        return date.getDay() < 1 || date.getDay() > 5;
    }
}
