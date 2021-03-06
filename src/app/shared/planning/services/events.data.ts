import { SchedulerEvent } from '../models/scheduler-event.model';

export const events: SchedulerEvent[] = [
    {
        id: 1,
        title: 'Meeting with subordinates',
        OwnerID: 1,
        start: (function () {
            const d = new Date(); d.setHours(10); d.setMinutes(0);
            d.setSeconds(0);
            d.setDate(d.getDate() + 2); return d;
        }()),
        end: (function () {
            const d = new Date(); d.setHours(10); d.setMinutes(0);
            d.setSeconds(0);
            d.setDate(d.getDate() + 3); return d;
        }())
    },
    {
        id: 2,
        title: 'Testing approach clarification',
        OwnerID: 2,
        start: (function () {
            const d = new Date(); d.setHours(10); d.setMinutes(0);
            d.setSeconds(0); d.setDate(d.getDate() + 2); return d;
        }()),
        end: (function () {
            const d = new Date(); d.setHours(15); d.setMinutes(0); d.setDate(d.getDate() + 2);
            d.setSeconds(0); d.setMinutes(d.getMinutes()); return d;
        }())
    },
    {
        id: 3,
        title: 'Knowledge share with client',
        OwnerID: 4,
        start: (function () { const d = new Date(); d.setDate(d.getDate()); return d; }()),
        end: (function () { const d = new Date(); d.setDate(d.getDate() + 2); d.setMinutes(d.getMinutes() + 60); return d; }())
    }
];
