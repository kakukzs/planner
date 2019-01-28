import { dayCodes } from './day.model';

export interface SchedulerConfig {
    name?: string;
    text?: string;
    start?: Date;
    firstDayOfWeek?: dayCodes;
    lengthOfWeek?: number;
    numberOfWeeks?: number;
}

const today = new Date();

export const defaultConfig: SchedulerConfig = {
    start: today,
    firstDayOfWeek: dayCodes.MO,
    lengthOfWeek: 7,
    numberOfWeeks: 1
};

export const schedulerViews: SchedulerConfig[] = [
    {
        name: 'day',
        text: 'Day',
        lengthOfWeek: 2,
        numberOfWeeks: 1
    },
    {
        name: 'week',
        text: 'Week',
        lengthOfWeek: 7,
        numberOfWeeks: 1
    },
    {
        name: '3_weeks',
        text: '3 weeks',
        lengthOfWeek: 7,
        numberOfWeeks: 3
    }
];
