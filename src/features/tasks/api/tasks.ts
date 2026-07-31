/**
 * Tasks API — local persistence layer.
 *
 * @remarks
 * Uses localStorage via createLocalStore for local-only CRUD.
 * Replace this file with REST API calls when a backend is available.
 * The public interface (tasksApi) stays the same.
 */

import { createLocalStore } from "@/lib/local-store";
import { calendarApi } from "@/features/calendar/api/events";
import type { Task, CreateTask, UpdateTask } from "@/features/tasks/types/Task";

function toCreate(dto: CreateTask): Omit<Task, "id"> {
  return {
    title: dto.title,
    description: dto.description,
    priority: dto.priority,
    status: "todo",
    dueDate: dto.dueDate,
    checklist: dto.checklist?.map((c) => ({
      id: crypto.randomUUID(),
      text: c.text,
      completed: false,
    })),
    repeat: dto.repeat,
    reminder: dto.reminder,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function toUpdate(dto: UpdateTask): Partial<Omit<Task, "id">> {
  return {
    title: dto.title,
    description: dto.description,
    status: dto.status,
    priority: dto.priority,
    completedAt: dto.completedAt,
    dueDate: dto.dueDate,
    checklist: dto.checklist?.map((c) => ({
      id: crypto.randomUUID(),
      text: c.text,
      completed: false,
    })),
    repeat: dto.repeat,
    reminder: dto.reminder,
  };
}

const store = createLocalStore<Task>("tasks");

/**
 * Keeps a mirrored calendar event in sync with a task's due date, so tasks
 * with a due date also show up on the Calendar view (source: "task").
 * No-ops if the task has no due date and no mirrored event exists.
 */
async function syncCalendarEvent(task: Task): Promise<void> {
  const existing = await calendarApi.getBySourceId(task.id);

  if (!task.dueDate) {
    if (existing) await calendarApi.delete(existing.id);
    return;
  }

  if (existing) {
    await calendarApi.update(existing.id, {
      title: task.title,
      startDate: task.dueDate,
      allDay: false,
    });
  } else {
    await calendarApi.create({
      title: task.title,
      type: "task_deadline",
      startDate: task.dueDate,
      allDay: false,
      source: "task",
      sourceId: task.id,
    });
  }
}

export const tasksApi = {
  getAll: store.getAll,
  getById: store.getById,
  create: async (dto: CreateTask) => {
    const task = await store.create(toCreate(dto));
    await syncCalendarEvent(task);
    return task;
  },
  update: async (id: string, dto: UpdateTask) => {
    const task = await store.update(id, toUpdate(dto));
    await syncCalendarEvent(task);
    return task;
  },
  delete: async (id: string) => {
    const existing = await calendarApi.getBySourceId(id);
    if (existing) await calendarApi.delete(existing.id);
    await store.delete(id);
  },
};
