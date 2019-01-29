import { dayCodes } from './day.model';

export interface SchedulerConfig {
    /* The unique name of the config for identification */
    name?: string;
    /* The display text of the config for showing in e.g. view dropdown */
    text?: string;
    /* The start date of the current view of the scheduler calendar. */
    start?: Date;
    /* The first day of the week. If start date is not the same day then the view is reverted. */
    firstDayOfWeek?: dayCodes;
    /* Number of the days to show in the view. Can be only between 1 and 7. */
    lengthOfWeek?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    /* Number of weeks to show. */
    numberOfWeeks?: number;
    /* Number of time slots inside one day. */
    timeSlots?: number;
    /* The start time of the calendar day. */
    startTime?: Date;
    /* The end time of the calendar day. */
    endTime?: Date;
}

const today = new Date();
today.setHours(0);
today.setMinutes(0);
today.setSeconds(0);
today.setMilliseconds(0);

/* The default start time is 8:00 */
const startTime: Date = new Date();
startTime.setHours(8);
startTime.setMinutes(0);
startTime.setSeconds(0);
startTime.setMilliseconds(0);

/* The default end time is 16:00 */
const endTime: Date = new Date();
endTime.setHours(16);
endTime.setMinutes(0);
endTime.setSeconds(0);
endTime.setMilliseconds(0);

export const defaultConfig: SchedulerConfig = {
    start: today,
    firstDayOfWeek: dayCodes.MO,
    lengthOfWeek: 7,
    numberOfWeeks: 1,
    timeSlots: 2,
    startTime,
    endTime
};

export const schedulerViews: SchedulerConfig[] = [
    {
        name: 'day',
        text: 'Day',
        lengthOfWeek: 2,
        numberOfWeeks: 1,
        timeSlots: 4
    },
    {
        name: 'week',
        text: 'Week',
        lengthOfWeek: 7,
        numberOfWeeks: 1,
        timeSlots: 2
    },
    {
        name: '3_weeks',
        text: '3 weeks',
        lengthOfWeek: 7,
        numberOfWeeks: 3,
        timeSlots: 1
    }
];
