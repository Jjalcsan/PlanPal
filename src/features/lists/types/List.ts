export interface List {
    id: string;

    title: string;
    description?: string;
    type: ListType;
    mode: ListMode;
    items: ListItem[];

    recurrence?: RecurrenceRule;

    lastResetAt?: Date;
    nextResetAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

export interface ListItem {
    id: string;

    title: string;
    description?: string;

    completed: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export interface RecurrenceRule {
    frequency: RecurrenceFrequency;
    interval?: number; /** Example: interval: 2 + monthly = every 2 months*/
    dayOfWeek?: number; /** 0=Monday, 1=Tuesday, 2=Wednesday... */
    dayOfMonth?: number;
}

export type ListType =
    | "task"
    | "object"
    | "habit"
    | "custom";

export type ListMode =
    | "checklist"
    | "collection";

export type RecurrenceFrequency =
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly";