import type { TaskPriority, TaskStatus } from "@/features/tasks/types/Task";

export interface Settings {
    id: string;

    general: GeneralSettings;

    notifications: NotificationSettings;

    calendar: CalendarSettings;

    tasks: TaskSettings;

    lists: ListSettings;
}

export interface GeneralSettings {
    theme: Theme;

    language: string;

    dateFormat: DateFormat;

    firstDayOfWeek: number;
}

export interface NotificationSettings {
    enabled: boolean;

    taskReminders: boolean;

    eventReminders: boolean;

    listRenewals: boolean;
}

export interface CalendarSettings {
    defaultView: CalendarView;

    showTaskDeadlines: boolean;

    showBirthdays: boolean;

    showPayments: boolean;
}

export interface TaskSettings {
    defaultStatus: TaskStatus;

    defaultPriority: TaskPriority;

    autoCompleteSubtasks: boolean;
}

export interface ListSettings {
    resetCompletedItemsAutomatically: boolean;
}

export type Theme =
    | "light"
    | "dark"
    | "system";


export type DateFormat =
    | "dd/MM/yyyy"
    | "MM/dd/yyyy";


export type CalendarView =
    | "month"
    | "week"
    | "day";