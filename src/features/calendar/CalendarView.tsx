"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarHeader,
  ViewSelector,
  type CalendarViewMode,
  WeeklyStrip,
  MonthlyCalendar,
  Timeline,
  FloatingAddButton,
  CreateEventModal,
  EditEventModal,
} from "@/features/calendar/components";
import { calendarApi, seedDefaultCalendarEvents } from "@/features/calendar/api/events";
import { calendarTagsApi, seedDefaultCalendarTags } from "@/features/calendar/api/tags";
import type { CalendarEvent, CalendarEventTag } from "@/features/calendar/types/CalendarEvent";

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function buildWeeklyDays(selected: Date) {
  const start = getWeekStart(selected);
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    const weekday = date.toLocaleDateString(undefined, { weekday: "narrow" });
    return { date, label: weekday, day: date.getDate() };
  });
}

export default function CalendarView() {
  const [view, setView] = useState<CalendarViewMode>("weekly");
  const [selected, setSelected] = useState<Date>(new Date("2026-07-29T00:00:00"));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tags, setTags] = useState<CalendarEventTag[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    seedDefaultCalendarEvents().then(setEvents);
    seedDefaultCalendarTags().then(setTags);
  }, []);

  const selectedDayEvents = useMemo(() => {
    return events
      .filter((event) => isSameDay(event.startDate, selected))
      .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [events, selected]);

  const monthTitle = useMemo(() => formatMonthYear(selected), [selected]);

  const weeklyDays = useMemo(() => buildWeeklyDays(selected), [selected]);

  const handlePrevMonth = () => {
    setSelected((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelected((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleCreateTag = async (draft: { name: string; color: string; dotColor?: string }) => {
    const created = await calendarTagsApi.create(draft);
    setTags((prev) => [...prev, created]);
    return created;
  };

  return (
    <div className="flex flex-1 flex-col">
      <CalendarHeader title={monthTitle} />

      <main className="flex-1 space-y-6 overflow-y-auto px-4 pb-28">
        <ViewSelector value={view} onChange={setView} />

        {view === "weekly" && (
          <section className="space-y-4">
            <WeeklyStrip days={weeklyDays} selected={selected} events={events} onSelect={setSelected} />
            <Timeline events={selectedDayEvents} onEventClick={setEditingEvent} />
          </section>
        )}

        {view === "monthly" && (
          <section className="space-y-4">
            <MonthlyCalendar
              year={selected.getFullYear()}
              month={selected.getMonth()}
              selected={selected}
              events={events}
              onSelect={setSelected}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
            />
            <div>
              <h2 className="mb-3 text-lg font-semibold">
                {selected.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              <Timeline events={selectedDayEvents} onEventClick={setEditingEvent} />
            </div>
          </section>
        )}
      </main>

      <FloatingAddButton onClick={() => setIsCreateOpen(true)} />

      <CreateEventModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        tags={tags}
        onCreateTag={handleCreateTag}
        defaultDate={selected}
        onSave={async (dto) => {
          await calendarApi.create(dto);
          const refreshed = await calendarApi.getAll();
          setEvents(refreshed);
        }}
      />

      <EditEventModal
        open={editingEvent !== null}
        event={editingEvent}
        onClose={() => setEditingEvent(null)}
        tags={tags}
        onCreateTag={handleCreateTag}
        onSave={async (id, dto) => {
          await calendarApi.update(id, dto);
          const refreshed = await calendarApi.getAll();
          setEvents(refreshed);
        }}
        onDelete={async (id) => {
          await calendarApi.delete(id);
          const refreshed = await calendarApi.getAll();
          setEvents(refreshed);
        }}
      />
    </div>
  );
}
