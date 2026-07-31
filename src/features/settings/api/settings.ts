/**
 * Settings API — local persistence layer.
 *
 * @remarks
 * Uses localStorage directly for singleton settings document.
 * Replace this file with REST API calls when a backend is available.
 * The public interface (settingsApi) stays the same.
 */

import type { Settings } from "@/features/settings/types/Settings";
import type { Theme, DateFormat, CalendarView } from "@/features/settings/types/Settings";

const STORAGE_KEY = "planpal:settings";

const DEFAULT_SETTINGS: Settings = {
  id: "singleton",
  general: {
    theme: "system" as Theme,
    language: "en",
    dateFormat: "dd/MM/yyyy" as DateFormat,
    firstDayOfWeek: 1,
  },
  notifications: {
    enabled: true,
    taskReminders: true,
    eventReminders: true,
    listRenewals: true,
  },
  calendar: {
    defaultView: "month" as CalendarView,
    showTaskDeadlines: true,
    showBirthdays: true,
    showPayments: true,
  },
  tasks: {
    defaultStatus: "todo",
    defaultPriority: "medium",
    autoCompleteSubtasks: false,
  },
  lists: {
    resetCompletedItemsAutomatically: false,
  },
};

function read(): Settings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Settings) : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function write(settings: Settings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export const settingsApi = {
  get: async (): Promise<Settings> => {
    return Promise.resolve(read());
  },

  update: async (dto: Partial<Settings>): Promise<Settings> => {
    const current = read();
    const merged: Settings = { ...current, ...dto };
    write(merged);
    return Promise.resolve(merged);
  },
};