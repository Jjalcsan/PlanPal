import { runTest } from "@/lib/test-runner";
import { calendarApi } from "@/features/calendar/api/events";

const STORE_KEY = "planpal:calendar_events";

export function calendarTests() {
  return [
    runTest("calendar: create and getAll", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await calendarApi.create({
        title: "Team sync",
        type: "event",
        startDate: new Date("2026-07-20T09:00"),
        endDate: new Date("2026-07-20T10:00"),
      });
      if (!created.id) throw new Error("Expected an id");
      if (created.title !== "Team sync") throw new Error("title mismatch");
      if (created.source !== "manual") throw new Error("source should default to manual");

      const all = await calendarApi.getAll();
      if (all.length !== 1) throw new Error("Expected 1 event");
    }),

    runTest("calendar: getById", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await calendarApi.create({
        title: "Birthday",
        type: "birthday",
        startDate: new Date("2026-08-01"),
      });
      const found = await calendarApi.getById(created.id);
      if (!found || found.title !== "Birthday") throw new Error("getById failed");
    }),

    runTest("calendar: update", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await calendarApi.create({
        title: "Old title",
        type: "event",
        startDate: new Date(),
      });
      const updated = await calendarApi.update(created.id, {
        title: "New title",
        type: "reminder",
      });
      if (updated.title !== "New title") throw new Error("update title failed");
      if (updated.type !== "reminder") throw new Error("update type failed");
    }),

    runTest("calendar: delete", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await calendarApi.create({
        title: "Delete me",
        type: "event",
        startDate: new Date(),
      });
      await calendarApi.delete(created.id);
      const found = await calendarApi.getById(created.id);
      if (found) throw new Error("event should be deleted");
    }),

    runTest("calendar: create with allDay and recurrence", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await calendarApi.create({
        title: "Recurring",
        type: "payment",
        startDate: new Date("2026-07-01"),
        allDay: true,
        recurrence: { frequency: "monthly", interval: 1 },
      });
      if (!created.allDay) throw new Error("allDay should be true");
      if (created.recurrence?.frequency !== "monthly") throw new Error("recurrence mismatch");
    }),

    runTest("calendar: getById returns undefined for missing id", async () => {
      localStorage.removeItem(STORE_KEY);
      const result = await calendarApi.getById("nonexistent");
      if (result !== undefined) throw new Error("Expected undefined");
    }),
  ];
}