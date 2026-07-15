export interface Task {
    id: string;
    title: string;
    description: string;

    status: TaskStatus
    priority: TaskPriority

    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    dueDate?: Date;

    checklist?: ChecklistItem[];
}

export interface CreateTask {
    title: string;
    description: string;
    priority: TaskPriority
    dueDate?: Date;

    checklist?: CreateChecklistItem[]
}

export interface UpdateTask {
    title: string;
    description: string;

    status: TaskStatus
    priority: TaskPriority

    completedAt?: Date;
    dueDate?: Date;

    checklist?: CreateChecklistItem[]
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