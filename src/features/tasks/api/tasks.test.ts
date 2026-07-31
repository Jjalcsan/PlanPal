import { runTest } from "@/lib/test-runner";
import { tasksApi } from "@/features/tasks/api/tasks";

const STORE_KEY = "planpal:tasks";

export function tasksTests() {
  return [
    runTest("tasks: create and getAll", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await tasksApi.create({
        title: "Test task",
        description: "A description",
        priority: "high",
      });
      if (!created.id) throw new Error("Expected an id");
      if (created.title !== "Test task") throw new Error("title mismatch");
      if (created.status !== "todo") throw new Error("status should default to todo");

      const all = await tasksApi.getAll();
      if (all.length !== 1) throw new Error("Expected 1 task");
    }),

    runTest("tasks: getById", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await tasksApi.create({
        title: "Find me",
        description: "",
        priority: "low",
      });
      const found = await tasksApi.getById(created.id);
      if (!found || found.title !== "Find me") throw new Error("getById failed");
    }),

    runTest("tasks: update", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await tasksApi.create({
        title: "Before",
        description: "",
        priority: "medium",
      });
      const updated = await tasksApi.update(created.id, {
        title: "After",
        description: "",
        status: "in_progress",
        priority: "high",
      });
      if (updated.title !== "After") throw new Error("update title failed");
      if (updated.status !== "in_progress") throw new Error("update status failed");
    }),

    runTest("tasks: delete", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await tasksApi.create({
        title: "Delete me",
        description: "",
        priority: "low",
      });
      await tasksApi.delete(created.id);
      const found = await tasksApi.getById(created.id);
      if (found) throw new Error("task should be deleted");
    }),

    runTest("tasks: create with dueDate and checklist", async () => {
      localStorage.removeItem(STORE_KEY);
      const dueDate = new Date("2026-12-31");
      const created = await tasksApi.create({
        title: "With extras",
        description: "Checklist test",
        priority: "critical",
        dueDate,
        checklist: [{ text: "Step 1" }, { text: "Step 2" }],
      });
      if (created.dueDate?.getTime() !== dueDate.getTime()) throw new Error("dueDate mismatch");
      if (created.checklist?.length !== 2) throw new Error("Expected 2 checklist items");
      if (created.checklist?.[0].text !== "Step 1") throw new Error("checklist text mismatch");
    }),

    runTest("tasks: getById returns undefined for missing id", async () => {
      localStorage.removeItem(STORE_KEY);
      const result = await tasksApi.getById("nonexistent");
      if (result !== undefined) throw new Error("Expected undefined");
    }),

    runTest("tasks: delete non-existent does not throw", async () => {
      localStorage.removeItem(STORE_KEY);
      await tasksApi.delete("nonexistent");
    }),

    runTest("tasks: create sets dates", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await tasksApi.create({
        title: "Date check",
        description: "",
        priority: "low",
      });
      if (!(created.createdAt instanceof Date)) throw new Error("createdAt should be Date");
      if (!(created.updatedAt instanceof Date)) throw new Error("updatedAt should be Date");
    }),

    runTest("tasks: create with repeat and reminder", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await tasksApi.create({
        title: "Recurring",
        description: "",
        priority: "medium",
        repeat: "Doesn't repeat",
        reminder: "1 day before",
      });
      if (created.repeat !== "Doesn't repeat") throw new Error("repeat mismatch");
      if (created.reminder !== "1 day before") throw new Error("reminder mismatch");
    }),
  ];
}
