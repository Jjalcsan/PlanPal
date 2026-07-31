/**
 * Calendar Event Tags API — local persistence layer.
 *
 * @remarks
 * Tags created from the "Add Event" flow are persisted here so they can
 * be picked again from any future event, similar to how lists/tasks
 * persist their own local data.
 */

import { createLocalStore } from "@/lib/local-store";
import type { CalendarEventTag } from "@/features/calendar/types/CalendarEvent";

const store = createLocalStore<CalendarEventTag>("calendar_tags");

export const calendarTagsApi = {
  getAll: store.getAll,
  create: (dto: { name: string; color: string; dotColor?: string }) => store.create(dto),
};

const defaultTags: { name: string; color: string; dotColor: string }[] = [
  { name: "Personal", color: "bg-blue-100 text-blue-700", dotColor: "bg-blue-500" },
  { name: "Health", color: "bg-emerald-100 text-emerald-700", dotColor: "bg-emerald-500" },
  { name: "Work", color: "bg-orange-100 text-orange-700", dotColor: "bg-orange-500" },
  { name: "Birthday", color: "bg-purple-100 text-purple-700", dotColor: "bg-purple-500" },
];

/**
 * Seeds the local store with a handful of default tags the first time
 * the app is used (i.e. when the store is empty). No-ops if any tags
 * already exist, so it never overwrites user-created tags.
 */
export async function seedDefaultCalendarTags(): Promise<CalendarEventTag[]> {
  const existing = await store.getAll();
  if (existing.length > 0) return existing;

  for (const tag of defaultTags) {
    await calendarTagsApi.create(tag);
  }

  return store.getAll();
}
