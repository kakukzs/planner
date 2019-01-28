import { dayCodes } from '../models/day.model';
import { BehaviorSubject } from 'rxjs';
import { SchedulerConfig, defaultConfig, schedulerViews } from '../models/scheduler-config.model';

export class SchedulerService {
    private config: BehaviorSubject<SchedulerConfig>;
    private defaultConfig: SchedulerConfig = defaultConfig;
    private currentConfig: SchedulerConfig;

    constructor() {
        this.currentConfig = this.defaultConfig;
        this.config = new BehaviorSubject<SchedulerConfig>(this.currentConfig);
    }

    private _getDates(start: Date, firstDayOfWeek: dayCodes, lengthOfWeek: number): Date[] {
        const dates: Date[] = [];
        let fromDate: Date = start;
        while (dayCodes[fromDate.getDay()] !== dayCodes[firstDayOfWeek]) {
            fromDate = new Date(fromDate);
            fromDate.setDate(fromDate.getDate() - 1);
        }
        for (let i = 0; i < lengthOfWeek; i++) {
            const date = new Date();
            date.setFullYear(fromDate.getFullYear());
            date.setMonth(fromDate.getMonth());
            date.setDate(fromDate.getDate());
            dates.push(date);
            fromDate.setDate(fromDate.getDate() + 1);
        }
        return dates;
    }

    public getDates(start: Date, firstDayOfWeek: dayCodes,
        lengthOfWeek: number, numberOfWeeks: number): Date[] {
        let dates: Date[] = [];
        for (let i = 0; i < numberOfWeeks; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i * 7);
            dates = dates.concat(this._getDates(date, firstDayOfWeek, lengthOfWeek));
        }
        return dates;
    }

    public getConfigObservable(): BehaviorSubject<SchedulerConfig> {
        return this.config;
    }

    public updateConfig(newConfig: SchedulerConfig) {
        this.config.next({ ...this.currentConfig, ...newConfig });
    }
}
