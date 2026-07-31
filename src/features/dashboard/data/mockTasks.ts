import type { Task, TaskTag } from "@/features/tasks/types/Task";

const tags: Record<string, TaskTag> = {
  work: { id: "tag-work", name: "Work", color: "bg-blue-100 text-blue-700" },
  health: { id: "tag-health", name: "Health", color: "bg-cyan-100 text-cyan-700" },
  finance: { id: "tag-finance", name: "Finance", color: "bg-amber-100 text-amber-700" },
  personal: { id: "tag-personal", name: "Personal", color: "bg-green-100 text-green-700" },
};

export const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Review quarterly goals",
    description: "Go through team objectives and update progress.",
    status: "todo",
    priority: "high",
    tag: tags.work,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(new Date().setHours(10, 0, 0, 0)),
  },
  {
    id: "task-2",
    title: "Call dentist",
    description: "Confirm appointment for next week.",
    status: "todo",
    priority: "medium",
    tag: tags.health,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "task-3",
    title: "Submit expense report",
    description: "Attach receipts and submit before EOD.",
    status: "todo",
    priority: "critical",
    tag: tags.finance,
    createdAt: new Date(),
    updatedAt: new Date(),
    dueDate: new Date(new Date().setHours(16, 30, 0, 0)),
  },
  {
    id: "task-4",
    title: "Buy groceries",
    description: "Milk, eggs, bread, vegetables.",
    status: "todo",
    priority: "low",
    tag: tags.personal,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
