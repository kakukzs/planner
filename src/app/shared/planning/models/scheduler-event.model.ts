/**
 * Represents an instance of a Scheduler calendar event.
 */
export interface SchedulerEvent {
    /**
     * The unique identifier of the event.
     * Typically, the ID is a number.
     * Can also be a string or an object.
     */
    id?: any;
    /**
     * A reference to the original data item, if any.
     */
    dataItem?: any;
    /**
     * The start date of the event.
     */
    start: Date;
    /**
     * The timezone name for the start date.
     */
    startTimezone?: string;
    /**
     * The end date of the event.
     */
    end: Date;
    /**
     * The timezone name for the end date.
     */
    endTimezone?: string;
    /**
     * A Boolean flag which indicates that the event occurs throughout the day.
     */
    isAllDay?: boolean;
    /**
     * The title of the event.
     */
    title: string;
    /**
     * The detailed description of the event.
     */
    description?: string;
    /**
     * The rule which describes the recurring pattern of the event.
     */
    recurrenceRule?: string;
    /**
     * The `id` of the parent recurring event.
     */
    recurrenceId?: any;
    /**
     * The recurrence exceptions, if any.
     */
    recurrenceExceptions?: Date[];

    OwnerID: number;

    RoomID?: number;
}

export interface SchedulerEventRect {
    /* The left offset of the event inside the calendar in percentage */
    left: number;

    /* The width of the event inside the calendar in percentage */
    width: number;

    /* Boolean to indicate if the values are in percentage */
    isPercentage?: boolean;
}
