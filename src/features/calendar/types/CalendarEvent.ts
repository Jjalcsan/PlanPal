export interface CalendarEventTag {
    id: string;
    name: string;
    color: string;
    dotColor?: string; /** Solid color class used for small indicator dots (e.g. "bg-blue-500"). */
}

export interface CalendarEvent {
    id: string;

    title: string;
    description?: string;
    location?: string;
    type: CalendarEventType;
    category?: CalendarEventCategory;
    tag?: CalendarEventTag;

    startDate: Date;
    endDate?: Date;

    allDay: boolean;
    recurrence?: RecurrenceRule;

    source: CalendarEventSource; /** Is the event manually created or is it coming from a task's due date. */
    sourceId?: string; /** If the event comes from a task --> sourceId = task.id */

    createdAt: Date;
    updatedAt: Date;
}


export interface CreateCalendarEvent {
    title: string;
    description?: string;
    location?: string;
    type: CalendarEventType;
    category?: CalendarEventCategory;
    tag?: CalendarEventTag;

    startDate: Date;
    endDate?: Date;

    allDay?: boolean;
    recurrence?: RecurrenceRule;

    source?: CalendarEventSource;
    sourceId?: string;
}


export interface UpdateCalendarEvent {
    title?: string;
    description?: string;
    location?: string;
    type?: CalendarEventType;
    category?: CalendarEventCategory;
    tag?: CalendarEventTag;

    startDate?: Date;
    endDate?: Date;

    allDay?: boolean;
    recurrence?: RecurrenceRule;
}

export interface RecurrenceRule {
    frequency: RecurrenceFrequency;
    interval?: number; /** Example: interval: 2 + monthly = every 2 months*/
    until?: Date;
}

export type CalendarEventCategory =
    | "personal"
    | "health"
    | "work"
    | "birthday";

export type CalendarEventType =
    | "event"
    | "birthday"
    | "payment"
    | "task_deadline"
    | "reminder";


export type CalendarEventSource =
    | "manual"
    | "task";


export type RecurrenceFrequency =
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly";
