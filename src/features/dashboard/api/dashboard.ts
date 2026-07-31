/**
 * Dashboard API — local persistence layer.
 *
 * @remarks
 * Computes dashboard data from the local stores of tasks, events, and lists.
 * Replace this file with a dedicated REST endpoint when a backend is available.
 * The public interface (dashboardApi) stays the same.
 */

import { createLocalStore } from "@/lib/local-store";
import type { Task } from "@/features/tasks/types/Task";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";
import type { List } from "@/features/lists/types/List";
import type { DashboardData } from "@/features/dashboard/types/DashboardData";

const taskStore = createLocalStore<Task>("tasks");
const eventStore = createLocalStore<CalendarEvent>("calendar_events");
const listStore = createLocalStore<List>("lists");

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const [tasks, events, lists] = await Promise.all([
      taskStore.getAll(),
      eventStore.getAll(),
      listStore.getAll(),
    ]);

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86_400_000);
    const weekAgo = new Date(todayStart.getTime() - 7 * 86_400_000);

    const pending = tasks.filter((t) => t.status !== "done" && t.status !== "cancelled");
    const completed = tasks.filter((t) => t.status === "done");
    const overdue = tasks.filter(
      (t) => t.dueDate && t.dueDate < now && t.status !== "done" && t.status !== "cancelled",
    );
    const dueToday = tasks.filter(
      (t) => t.dueDate && t.dueDate >= todayStart && t.dueDate < todayEnd,
    );

    const todayEvents = events.filter(
      (e) => e.startDate >= todayStart && e.startDate < todayEnd,
    );
    const upcomingEvents = events.filter((e) => e.startDate >= todayEnd);

    const allItems = lists.flatMap((l) => l.items);
    const incompleteItems = allItems.filter((i) => !i.completed);
    const completedItems = allItems.filter((i) => i.completed);
    const renewingSoon = lists.filter(
      (l) => l.nextResetAt && l.nextResetAt < todayEnd,
    );

    const tasksCompletedThisWeek = tasks.filter(
      (t) => t.completedAt && t.completedAt >= weekAgo && t.completedAt < now,
    ).length;
    const totalTasksDue = tasks.filter((t) => t.dueDate).length;
    const completionRate = totalTasksDue > 0
      ? completed.length / totalTasksDue
      : 0;

    return {
      tasks: {
        pending: pending.length,
        completed: completed.length,
        overdue: overdue.length,
        dueToday: dueToday.length,
      },
      events: {
        today: todayEvents,
        upcoming: upcomingEvents,
      },
      lists: {
        incomplete: incompleteItems.length,
        completed: completedItems.length,
        renewingSoon: renewingSoon.length,
      },
      statistics: {
        tasksCompletedThisWeek,
        completionRate,
      },
    };
  },
};