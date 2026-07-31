export interface TaskTag {
    id: string;
    name: string;
    color: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;

    status: TaskStatus
    priority: TaskPriority
    tag?: TaskTag;

    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    dueDate?: Date;

    checklist?: ChecklistItem[];

    repeat?: RepeatOption;
    reminder?: ReminderOption;
}

export interface CreateTask {
    title: string;
    description: string;
    priority: TaskPriority
    dueDate?: Date;
    tag?: TaskTag;

    checklist?: CreateChecklistItem[];

    repeat?: RepeatOption;
    reminder?: ReminderOption;
}

export interface UpdateTask {
    title: string;
    description: string;

    status: TaskStatus
    priority: TaskPriority
    tag?: TaskTag;

    completedAt?: Date;
    dueDate?: Date;

    checklist?: CreateChecklistItem[];

    repeat?: RepeatOption;
    reminder?: ReminderOption;
}

export interface ChecklistItem {
    id: string;
    text: string;
    completed: boolean;
}

export interface CreateChecklistItem {
    text: string;
}

export type TaskStatus =
    | "todo"
    | "in_progress"
    | "blocked"
    | "done"
    | "cancelled";

export type TaskPriority =
    | "low"
    | "medium"
    | "high"
    | "critical";

export type RepeatOption =
    | "Doesn't repeat"
    | "1 day"
    | "2 days"
    | "1 week"
    | "2 weeks"
    | "monthly"
    | "Semestral"
    | "yearly";

export type ReminderOption =
    | "None"
    | "5 minutes before"
    | "15 minutes before"
    | "30 minutes before"
    | "1 hour before"
    | "1 day before";