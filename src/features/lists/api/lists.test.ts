import { runTest } from "@/lib/test-runner";
import { listsApi } from "@/features/lists/api/lists";

const STORE_KEY = "planpal:lists";

export function listsTests() {
  return [
    runTest("lists: create and getAll", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await listsApi.create({
        title: "Groceries",
        type: "task",
        mode: "checklist",
      });
      if (!created.id) throw new Error("Expected an id");
      if (created.title !== "Groceries") throw new Error("title mismatch");
      if (created.items.length !== 0) throw new Error("should start with no items");

      const all = await listsApi.getAll();
      if (all.length !== 1) throw new Error("Expected 1 list");
    }),

    runTest("lists: getById", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await listsApi.create({
        title: "Chores",
        type: "habit",
        mode: "checklist",
      });
      const found = await listsApi.getById(created.id);
      if (!found || found.title !== "Chores") throw new Error("getById failed");
    }),

    runTest("lists: update", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await listsApi.create({
        title: "Before",
        type: "custom",
        mode: "collection",
      });
      const updated = await listsApi.update(created.id, {
        title: "After",
      });
      if (updated.title !== "After") throw new Error("update title failed");
    }),

    runTest("lists: delete", async () => {
      localStorage.removeItem(STORE_KEY);
      const created = await listsApi.create({
        title: "Delete me",
        type: "task",
        mode: "checklist",
      });
      await listsApi.delete(created.id);
      const found = await listsApi.getById(created.id);
      if (found) throw new Error("list should be deleted");
    }),

    runTest("lists: addItem, getItems", async () => {
      localStorage.removeItem(STORE_KEY);
      const list = await listsApi.create({
        title: "With items",
        type: "object",
        mode: "collection",
      });
      await listsApi.addItem(list.id, { title: "Item 1" });
      await listsApi.addItem(list.id, { title: "Item 2" });

      const items = await listsApi.getItems(list.id);
      if (items.length !== 2) throw new Error("Expected 2 items");

      const updated = await listsApi.getById(list.id);
      if (updated?.items.length !== 2) throw new Error("list should also have 2 items");
    }),

    runTest("lists: updateItem", async () => {
      localStorage.removeItem(STORE_KEY);
      const list = await listsApi.create({
        title: "Items",
        type: "task",
        mode: "checklist",
      });
      await listsApi.addItem(list.id, { title: "Old" });
      const items = await listsApi.getItems(list.id);
      await listsApi.updateItem(list.id, items[0].id, {
        title: "New",
        completed: true,
      });
      const updatedItems = await listsApi.getItems(list.id);
      if (updatedItems[0].title !== "New") throw new Error("updateItem title failed");
      if (!updatedItems[0].completed) throw new Error("updateItem completed failed");
    }),

    runTest("lists: deleteItem", async () => {
      localStorage.removeItem(STORE_KEY);
      const list = await listsApi.create({
        title: "Items",
        type: "task",
        mode: "checklist",
      });
      await listsApi.addItem(list.id, { title: "Keep" });
      await listsApi.addItem(list.id, { title: "Remove" });
      const items = await listsApi.getItems(list.id);
      await listsApi.deleteItem(list.id, items[1].id);
      const remaining = await listsApi.getItems(list.id);
      if (remaining.length !== 1) throw new Error("Expected 1 item after delete");
      if (remaining[0].title !== "Keep") throw new Error("wrong item remaining");
    }),

    runTest("lists: toggleItem", async () => {
      localStorage.removeItem(STORE_KEY);
      const list = await listsApi.create({
        title: "Toggle",
        type: "habit",
        mode: "checklist",
      });
      await listsApi.addItem(list.id, { title: "Toggle me" });
      let items = await listsApi.getItems(list.id);
      await listsApi.toggleItem(list.id, items[0].id, true);
      items = await listsApi.getItems(list.id);
      if (!items[0].completed) throw new Error("toggleItem completed failed");
      await listsApi.toggleItem(list.id, items[0].id, false);
      items = await listsApi.getItems(list.id);
      if (items[0].completed) throw new Error("toggleItem un-completed failed");
    }),
  ];
}