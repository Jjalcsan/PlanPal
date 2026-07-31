"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DashboardHeader,
  DailySummaryRow,
  ProgressCard,
  SummaryGrid,
} from "@/features/dashboard/components";
import { tasksApi } from "@/features/tasks/api/tasks";
import { seedDefaultCalendarEvents } from "@/features/calendar/api/events";
import { seedDefaultLists } from "@/features/lists/api/lists";
import type { Task } from "@/features/tasks/types/Task";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";
import type { List } from "@/features/lists/types/List";

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isListActive(list: List): boolean {
  if (list.mode === "collection") return true;
  if (list.items.length === 0) return true;
  return list.items.some((item) => !item.completed);
}

function getWeekStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  return d;
}

export default function DashboardView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    tasksApi.getAll().then(setTasks);
    seedDefaultCalendarEvents().then(setEvents);
    seedDefaultLists().then(setLists);
  }, []);

  const todayTasks = useMemo(() => {
    const today = new Date();
    return tasks
      .filter(
        (t) =>
          t.dueDate &&
          isSameDay(t.dueDate, today) &&
          t.status !== "done" &&
          t.status !== "cancelled",
      )
      .sort((a, b) => (a.dueDate?.getTime() ?? 0) - (b.dueDate?.getTime() ?? 0));
  }, [tasks]);

  const todayEventsCount = useMemo(() => {
    const today = new Date();
    return events.filter((e) => isSameDay(e.startDate, today)).length;
  }, [events]);

  const activeLists = useMemo(() => lists.filter(isListActive), [lists]);

  const weeklyProgress = useMemo(() => {
    const weekStart = getWeekStart(new Date());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const tasksThisWeek = tasks.filter(
      (t) => t.dueDate && t.dueDate >= weekStart && t.dueDate < weekEnd,
    );
    if (tasksThisWeek.length === 0) return 0;

    const completedThisWeek = tasksThisWeek.filter((t) => t.status === "done").length;
    return Math.round((completedThisWeek / tasksThisWeek.length) * 100);
  }, [tasks]);

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
        <DailySummaryRow
          tasksToday={todayTasks.length}
          eventsToday={todayEventsCount}
          activeLists={activeLists.length}
          weeklyProgress={weeklyProgress}
        />
        <SummaryGrid tasks={todayTasks} events={events} lists={activeLists} />
        <ProgressCard progress={weeklyProgress} />
      </main>
    </div>
  );
}
