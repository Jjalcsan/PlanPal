/**
 * Temporary in-memory + localStorage store.
 *
 * @remarks
 * This is a local-only persistence layer meant for development.
 * It uses localStorage for persistence across page reloads and
 * an in-memory cache to handle Date objects (which lose their
 * type when serialized through JSON).
 *
 * When a real backend is added, replace each feature's API file
 * (e.g. src/features/tasks/api/tasks.ts) to call REST endpoints
 * instead of this store. The public API surface (tasksApi, etc.)
 * stays the same, so views need no changes.
 */

const STORE_PREFIX = "planpal:";

function getStore<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORE_PREFIX + key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function setStore<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_PREFIX + key, JSON.stringify(data));
}

export function createLocalStore<T extends { id: string }>(key: string) {
  const revive = (item: T) =>
    JSON.parse(JSON.stringify(item), (_k, v) => {
      if (
        typeof v === "string" &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v)
      ) {
        return new Date(v);
      }
      return v;
    }) as T;

  return {
    getAll: (): Promise<T[]> => {
      const items = getStore<T>(key).map(revive);
      return Promise.resolve(items);
    },

    getById: (id: string): Promise<T | undefined> => {
      const items = getStore<T>(key).map(revive);
      return Promise.resolve(items.find((i) => i.id === id));
    },

    create: (dto: Omit<T, "id">): Promise<T> => {
      const items = getStore<T>(key);
      const now = new Date();
      const item = {
        ...dto,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as unknown as T;
      items.push(item);
      setStore(key, items);
      return Promise.resolve(revive(item));
    },

    update: (id: string, dto: Partial<Omit<T, "id">>): Promise<T> => {
      const items = getStore<T>(key);
      const idx = items.findIndex((i) => i.id === id);
      if (idx === -1) return Promise.reject(new Error(`Not found: ${id}`));
      const updated = {
        ...items[idx],
        ...dto,
        updatedAt: new Date(),
      };
      items[idx] = updated;
      setStore(key, items);
      return Promise.resolve(revive(updated));
    },

    delete: (id: string): Promise<void> => {
      const items = getStore<T>(key);
      setStore(
        key,
        items.filter((i) => i.id !== id),
      );
      return Promise.resolve();
    },
  };
}
