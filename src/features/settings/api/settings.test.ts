import { runTest } from "@/lib/test-runner";
import { settingsApi } from "@/features/settings/api/settings";
import { usersApi } from "@/features/settings/api/users";

const SETTINGS_KEY = "planpal:settings";
const USERS_KEY = "planpal:users";

export function settingsTests() {
  return [
    runTest("settings: get returns defaults when empty", async () => {
      localStorage.removeItem(SETTINGS_KEY);
      const s = await settingsApi.get();
      if (s.general.theme !== "system") throw new Error("default theme mismatch");
      if (s.general.language !== "en") throw new Error("default language mismatch");
    }),

    runTest("settings: update and persist", async () => {
      localStorage.removeItem(SETTINGS_KEY);
      const updated = await settingsApi.update({
        general: {
          theme: "dark",
          language: "en",
          dateFormat: "MM/dd/yyyy",
          firstDayOfWeek: 0,
        },
      });
      if (updated.general.theme !== "dark") throw new Error("update theme failed");

      const s = await settingsApi.get();
      if (s.general.theme !== "dark") throw new Error("persist theme failed");
    }),

    runTest("settings: partial update merges correctly", async () => {
      localStorage.removeItem(SETTINGS_KEY);
      await settingsApi.update({
        notifications: { enabled: false, taskReminders: false, eventReminders: false, listRenewals: false },
      });
      const s = await settingsApi.get();
      if (s.general.theme !== "system") throw new Error("merge: theme should still be default");
      if (s.notifications.enabled !== false) throw new Error("merge: notifications should be false");
    }),
  ];
}

export function usersTests() {
  return [
    runTest("users: create and getAll", async () => {
      localStorage.removeItem(USERS_KEY);
      const created = await usersApi.create({ name: "Alice" });
      if (!created.id) throw new Error("Expected an id");
      if (created.name !== "Alice") throw new Error("name mismatch");

      const all = await usersApi.getAll();
      if (all.length !== 1) throw new Error("Expected 1 user");
    }),

    runTest("users: update", async () => {
      localStorage.removeItem(USERS_KEY);
      const u = await usersApi.create({ name: "Bob" });
      const updated = await usersApi.update(u.id, { name: "Robert" });
      if (updated.name !== "Robert") throw new Error("update name failed");
    }),

    runTest("users: delete", async () => {
      localStorage.removeItem(USERS_KEY);
      const u = await usersApi.create({ name: "Temporary" });
      await usersApi.delete(u.id);
      const found = await usersApi.getById(u.id);
      if (found) throw new Error("user should be deleted");
    }),
  ];
}