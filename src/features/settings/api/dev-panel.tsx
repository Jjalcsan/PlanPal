"use client";

import { useState, useEffect, useCallback } from "react";
import { CrudPanel, type CrudField } from "@/lib/dev/crud-panel";
import { settingsApi } from "@/features/settings/api/settings";
import { usersApi } from "@/features/settings/api/users";
import type { Settings } from "@/features/settings/types/Settings";
import type { User } from "@/features/settings/types/User";
import {
  type Theme, type DateFormat, type CalendarView,
} from "@/features/settings/types/Settings";

const THEME_OPTIONS: { label: string; value: string }[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const DATE_OPTIONS: { label: string; value: string }[] = [
  { label: "dd/MM/yyyy", value: "dd/MM/yyyy" },
  { label: "MM/dd/yyyy", value: "MM/dd/yyyy" },
];

const VIEW_OPTIONS: { label: string; value: string }[] = [
  { label: "Month", value: "month" },
  { label: "Week", value: "week" },
  { label: "Day", value: "day" },
];

const SETTINGS_FIELDS: CrudField[] = [
  { name: "theme", label: "Theme", type: "select", options: THEME_OPTIONS },
  { name: "language", label: "Language", type: "text" },
  { name: "dateFormat", label: "Date format", type: "select", options: DATE_OPTIONS },
  { name: "defaultView", label: "Calendar default view", type: "select", options: VIEW_OPTIONS },
];

const USER_FIELDS: CrudField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "avatarUrl", label: "Avatar URL", type: "text" },
];

export function SettingsDevPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const s = await settingsApi.get();
      setSettings(s);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toValues = (s: Settings) => ({
    theme: s.general.theme,
    language: s.general.language,
    dateFormat: s.general.dateFormat,
    defaultView: s.calendar.defaultView,
  });

  const formatItem = (s: Settings) =>
    `Theme: ${s.general.theme}, Lang: ${s.general.language}, Date: ${s.general.dateFormat}, Calendar: ${s.calendar.defaultView}`;

  const onUpdate = async (_id: string, vals: Record<string, string>) => {
    setSaving(true);
    try {
      await settingsApi.update({
        general: {
          theme: vals.theme as Theme || "system",
          language: vals.language || "en",
          dateFormat: vals.dateFormat as DateFormat || "dd/MM/yyyy",
          firstDayOfWeek: 1,
        },
        calendar: {
          defaultView: vals.defaultView as CalendarView || "month",
          showTaskDeadlines: true,
          showBirthdays: true,
          showPayments: true,
        },
      });
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return <p className="text-sm text-muted-foreground">Loading settings...</p>;

  return (
    <div className="flex flex-col gap-4">
      <CrudPanel
        title="Settings"
        storeKey="settings"
        fields={SETTINGS_FIELDS}
        items={[settings]}
        loading={loading}
        error={error}
        onRefresh={load}
        onCreate={(_vals) => onUpdate(settings.id, _vals)}
        onUpdate={onUpdate}
        onDelete={() => Promise.resolve()}
        toValues={toValues}
        formatItem={formatItem}
      />

      <UsersDevPanel />
    </div>
  );
}

function UsersDevPanel() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await usersApi.getAll();
      setItems(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toValues = (u: User) => ({
    name: u.name,
    avatarUrl: u.avatarUrl ?? "",
  });

  const formatItem = (u: User) => `${u.name}${u.avatarUrl ? " (avatar)" : ""}`;

  const onCreate = async (vals: Record<string, string>) => {
    await usersApi.create({
      name: vals.name,
      avatarUrl: vals.avatarUrl || undefined,
    });
    await load();
  };

  const onUpdate = async (id: string, vals: Record<string, string>) => {
    await usersApi.update(id, {
      name: vals.name,
      avatarUrl: vals.avatarUrl || undefined,
    });
    await load();
  };

  const onDelete = async (id: string) => {
    await usersApi.delete(id);
    await load();
  };

  return (
    <CrudPanel
      title="Users"
      storeKey="users"
      fields={USER_FIELDS}
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