"use client";

import { useState, useEffect, useCallback } from "react";
import { CrudPanel, type CrudField } from "@/lib/dev/crud-panel";
import { tasksApi } from "@/features/tasks/api/tasks";
import type { Task } from "@/features/tasks/types/Task";
import type { TaskStatus, TaskPriority } from "@/features/tasks/types/Task";

const STATUS_OPTIONS: { label: string; value: string }[] = [
  "todo", "in_progress", "blocked", "done", "cancelled",
].map((s) => ({ label: s.replace("_", " "), value: s }));

const PRIORITY_OPTIONS: { label: string; value: string }[] = [
  "low", "medium", "high", "critical",
].map((p) => ({ label: p, value: p }));

const FIELDS: CrudField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "status", label: "Status", type: "select", options: STATUS_OPTIONS },
  { name: "priority", label: "Priority", type: "select", options: PRIORITY_OPTIONS },
  { name: "dueDate", label: "Due date", type: "date" },
];

export function TasksDevPanel() {
  const [items, setItems] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await tasksApi.getAll();
      setItems(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toValues = (t: Task) => ({
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate ? t.dueDate.toISOString().slice(0, 10) : "",
  });

  const formatItem = (t: Task) =>
    `[${t.priority}] ${t.title} — ${t.status}${t.dueDate ? ` (due ${t.dueDate.toLocaleDateString()})` : ""}`;

  const onCreate = async (vals: Record<string, string>) => {
    await tasksApi.create({
      title: vals.title,
      description: vals.description,
      priority: vals.priority as TaskPriority || "medium",
      dueDate: vals.dueDate ? new Date(vals.dueDate) : undefined,
    });
    await load();
  };

  const onUpdate = async (id: string, vals: Record<string, string>) => {
    await tasksApi.update(id, {
      title: vals.title,
      description: vals.description,
      status: vals.status as TaskStatus || "todo",
      priority: vals.priority as TaskPriority || "medium",
      dueDate: vals.dueDate ? new Date(vals.dueDate) : undefined,
    });
    await load();
  };

  const onDelete = async (id: string) => {
    await tasksApi.delete(id);
    await load();
  };

  return (
    <CrudPanel
      title="Tasks"
      storeKey="tasks"
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