import { dayCodes } from '../models/day.model';
import { BehaviorSubject } from 'rxjs';
import { SchedulerConfig, defaultConfig, schedulerViews } from '../models/scheduler-config.model';
import { SchedulerEvent } from '../models/scheduler-event.model';
import { events } from './events.data';

export class SchedulerService {
    private config$: BehaviorSubject<SchedulerConfig>;
    private dates$: BehaviorSubject<Date[]>;
    private events$: BehaviorSubject<SchedulerEvent[]>;

    private defaultConfig: SchedulerConfig = defaultConfig;
    private currentConfig: SchedulerConfig;
    private schedulerViews: SchedulerConfig[];
    private events: SchedulerEvent[];

    constructor() {
        this.currentConfig = this.defaultConfig;
        this.events = events;
        this.config$ = new BehaviorSubject<SchedulerConfig>(this.currentConfig);
        this.dates$ = new BehaviorSubject<Date[]>(null);
        this.events$ = new BehaviorSubject<SchedulerEvent[]>(this.events);
        this.schedulerViews = schedulerViews;
        this.config$.subscribe((config: SchedulerConfig) => {
            this.dates$.next(this.getDates(config.start, config.firstDayOfWeek, config.lengthOfWeek, config.numberOfWeeks));
        });
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
            date.setTime(fromDate.getTime());
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            dates.push(date);
            fromDate.setDate(fromDate.getDate() + 1);
        }
        return dates;
    }

    private getDates(start: Date, firstDayOfWeek: dayCodes,
        lengthOfWeek: number, numberOfWeeks: number): Date[] {
        let dates: Date[] = [];
        for (let i = 0; i < numberOfWeeks; i++) {
            const date = new Date(start);
            date.setDate(date.getDate() + i * 7);
            dates = dates.concat(this._getDates(date, firstDayOfWeek, lengthOfWeek));
        }
        return dates;
    }

    public getSchedulerViews(): SchedulerConfig[] {
        return this.schedulerViews.slice();
    }

    public getConfigObservable(): BehaviorSubject<SchedulerConfig> {
        return this.config$;
    }

    public getDatesObservable(): BehaviorSubject<Date[]> {
        return this.dates$;
    }

    public updateConfig(newConfig: SchedulerConfig) {
        this.config$.next({ ...this.currentConfig, ...newConfig });
    }

    public getEventsObservable(): BehaviorSubject<SchedulerEvent[]> {
        return this.events$;
    }

    public updateEvent(oldEvent: SchedulerEvent, newEvent: SchedulerEvent) {
        this.events = [
            ...this.events.filter((ev: SchedulerEvent) => ev !== oldEvent),
            newEvent
        ];
        this.events$.next(this.events);
    }

    public addEvent(newEvent: SchedulerEvent) {
        newEvent.id = ~~(Math.random() * 1000);
        this.events = [
            ...this.events,
            newEvent
        ];
        this.events$.next(this.events);
    }
}
