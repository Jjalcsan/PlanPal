/**
 * Calendar Events API — local persistence layer.
 *
 * @remarks
 * Uses localStorage via createLocalStore for local-only CRUD.
 * Replace this file with REST API calls when a backend is available.
 * The public interface (calendarApi) stays the same.
 */

import { createLocalStore } from "@/lib/local-store";
import type {
  CalendarEvent,
  CreateCalendarEvent,
  UpdateCalendarEvent,
} from "@/features/calendar/types/CalendarEvent";
import { mockCalendarEvents } from "@/features/calendar/data/mockCalendarEvents";

function toCreate(dto: CreateCalendarEvent): Omit<CalendarEvent, "id"> {
  return {
    title: dto.title,
    description: dto.description,
    location: dto.location,
    type: dto.type,
    category: dto.category,
    tag: dto.tag,
    startDate: dto.startDate,
    endDate: dto.endDate ?? dto.startDate,
    allDay: dto.allDay ?? false,
    recurrence: dto.recurrence,
    source: dto.source ?? "manual",
    sourceId: dto.sourceId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const store = createLocalStore<CalendarEvent>("calendar_events");

export const calendarApi = {
  getAll: store.getAll,
  getById: store.getById,
  create: (dto: CreateCalendarEvent) => store.create(toCreate(dto)),
  update: (id: string, dto: UpdateCalendarEvent) => store.update(id, dto),
  delete: store.delete,
  getBySourceId: async (sourceId: string): Promise<CalendarEvent | undefined> => {
    const all = await store.getAll();
    return all.find((event) => event.sourceId === sourceId);
  },
};

/**
 * Seeds the local store with the example events the first time the app
 * is used (i.e. when the store is empty). No-ops if any events already
 * exist, so it never overwrites user data.
 */
export async function seedDefaultCalendarEvents(): Promise<CalendarEvent[]> {
  const existing = await store.getAll();
  if (existing.length > 0) return existing;

  for (const seed of mockCalendarEvents) {
    await calendarApi.create({
      title: seed.title,
      description: seed.description,
      location: seed.location,
      type: seed.type,
      category: seed.category,
      tag: seed.tag,
      startDate: seed.startDate,
      endDate: seed.endDate,
      allDay: seed.allDay,
      recurrence: seed.recurrence,
      source: seed.source,
      sourceId: seed.sourceId,
    });
  }

  return store.getAll();
}
