import { runTest } from "@/lib/test-runner";
import { tasksApi } from "@/features/tasks/api/tasks";
import { calendarApi } from "@/features/calendar/api/events";
import { listsApi } from "@/features/lists/api/lists";
import { dashboardApi } from "@/features/dashboard/api/dashboard";

const TASKS_KEY = "planpal:tasks";
const EVENTS_KEY = "planpal:calendar_events";
const LISTS_KEY = "planpal:lists";

export function dashboardTests() {
  return [
    runTest("dashboard: returns empty state", async () => {
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(EVENTS_KEY);
      localStorage.removeItem(LISTS_KEY);
      const data = await dashboardApi.get();
      if (data.tasks.pending !== 0) throw new Error("Expected 0 pending tasks");
      if (data.tasks.completed !== 0) throw new Error("Expected 0 completed tasks");
      if (data.events.today.length !== 0) throw new Error("Expected 0 today events");
      if (data.lists.incomplete !== 0) throw new Error("Expected 0 incomplete items");
    }),

    runTest("dashboard: computes task summary", async () => {
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(EVENTS_KEY);
      localStorage.removeItem(LISTS_KEY);
      await tasksApi.create({ title: "Task 1", description: "", priority: "high" });
      await tasksApi.create({ title: "Task 2", description: "", priority: "medium" });
      const data = await dashboardApi.get();
      if (data.tasks.pending !== 2) throw new Error("Expected 2 pending");
    }),

    runTest("dashboard: computes today events", async () => {
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(EVENTS_KEY);
      localStorage.removeItem(LISTS_KEY);
      const now = new Date();
      await calendarApi.create({
        title: "Today event",
        type: "event",
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
      });
      await calendarApi.create({
        title: "Tomorrow event",
        type: "event",
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0),
      });
      const data = await dashboardApi.get();
      if (data.events.today.length !== 1) throw new Error("Expected 1 today event");
      if (data.events.upcoming.length !== 1) throw new Error("Expected 1 upcoming event");
    }),

    runTest("dashboard: computes list summary", async () => {
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(EVENTS_KEY);
      localStorage.removeItem(LISTS_KEY);
      const list = await listsApi.create({
        title: "Shopping",
        type: "task",
        mode: "checklist",
      });
      await listsApi.addItem(list.id, { title: "Milk" });
      await listsApi.addItem(list.id, { title: "Eggs" });
      const items = await listsApi.getItems(list.id);
      await listsApi.toggleItem(list.id, items[0].id, true);

      const data = await dashboardApi.get();
      if (data.lists.incomplete !== 1) throw new Error("Expected 1 incomplete");
      if (data.lists.completed !== 1) throw new Error("Expected 1 completed");
    }),
  ];
}