import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";

export interface DashboardData {
    tasks: DashboardTaskSummary;

    events: DashboardEventSummary;

    lists: DashboardListSummary;

    statistics: DashboardStatistics;
}

export interface DashboardTaskSummary {
    pending: number;
    completed: number;
    overdue: number;
    dueToday: number;
}
export interface DashboardEventSummary {
    today: CalendarEvent[];
    upcoming: CalendarEvent[];
}
export interface DashboardListSummary {
    incomplete: number;
    completed: number;
    renewingSoon: number;
}
export interface DashboardStatistics {
    tasksCompletedThisWeek: number;
    completionRate: number;
}