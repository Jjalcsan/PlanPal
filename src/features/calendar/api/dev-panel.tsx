"use client";

import { useState, useEffect, useCallback } from "react";
import { CrudPanel, type CrudField } from "@/lib/dev/crud-panel";
import { calendarApi } from "@/features/calendar/api/events";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";
import type { CalendarEventType } from "@/features/calendar/types/CalendarEvent";

const TYPE_OPTIONS: { label: string; value: string }[] = [
  "event", "birthday", "payment", "task_deadline", "reminder",
].map((t) => ({ label: t.replace("_", " "), value: t }));

const FIELDS: CrudField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "type", label: "Type", type: "select", options: TYPE_OPTIONS },
  { name: "startDate", label: "Start date", type: "date" },
  {
    name: "allDay",
    label: "All day",
    type: "checkbox",
  },
  { name: "description", label: "Description", type: "textarea" },
];

export function CalendarDevPanel() {
  const [items, setItems] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await calendarApi.getAll();
      setItems(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toValues = (e: CalendarEvent) => ({
    title: e.title,
    type: e.type,
    startDate: e.startDate.toISOString().slice(0, 10),
    allDay: e.allDay ? "true" : "false",
    description: e.description ?? "",
  });

  const formatItem = (e: CalendarEvent) =>
    `${e.title} (${e.type}) — ${e.startDate.toLocaleDateString()}${e.allDay ? " [all day]" : ""}`;

  const onCreate = async (vals: Record<string, string>) => {
    await calendarApi.create({
      title: vals.title,
      type: vals.type as CalendarEventType || "event",
      startDate: new Date(vals.startDate || Date.now()),
      allDay: vals.allDay === "true",
      description: vals.description || undefined,
    });
    await load();
  };

  const onUpdate = async (id: string, vals: Record<string, string>) => {
    await calendarApi.update(id, {
      title: vals.title,
      type: vals.type as CalendarEventType || "event",
      startDate: new Date(vals.startDate || Date.now()),
      allDay: vals.allDay === "true",
      description: vals.description || undefined,
    });
    await load();
  };

  const onDelete = async (id: string) => {
    await calendarApi.delete(id);
    await load();
  };

  return (
    <CrudPanel
      title="Calendar Events"
      storeKey="calendar_events"
      fields={FIELDS}
      items={items}
      loading={loading}
      error={error}
      onRefresh={load}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onDelete={onDelete}
      toValues={toValues}
      formatItem={formatItem}
    />
  );
}