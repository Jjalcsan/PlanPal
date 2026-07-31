/**
 * Lists API — local persistence layer.
 *
 * @remarks
 * Uses localStorage via createLocalStore for local-only CRUD.
 * Replace this file with REST API calls when a backend is available.
 * The public interface (listsApi) stays the same.
 */

import { createLocalStore } from "@/lib/local-store";
import { mockLists } from "@/features/lists/data/mockLists";
import type { List, ListItem, RecurrenceRule } from "@/features/lists/types/List";

export interface CreateListDTO {
  title: string;
  description?: string;
  type: List["type"];
  mode: List["mode"];
  recurrence?: RecurrenceRule;
  icon?: string;
  color?: string;
}

export interface UpdateListDTO {
  title?: string;
  description?: string;
  type?: List["type"];
  mode?: List["mode"];
  recurrence?: RecurrenceRule;
  icon?: string;
  color?: string;
}

export interface CreateListItemDTO {
  title: string;
  description?: string;
}

export interface UpdateListItemDTO {
  title?: string;
  description?: string;
  completed?: boolean;
}

function toCreate(dto: CreateListDTO): Omit<List, "id"> {
  return {
    title: dto.title,
    description: dto.description,
    type: dto.type,
    mode: dto.mode,
    items: [],
    recurrence: dto.recurrence,
    icon: dto.icon,
    color: dto.color,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const store = createLocalStore<List>("lists");

export const listsApi = {
  getAll: store.getAll,
  getById: store.getById,
  create: (dto: CreateListDTO) => store.create(toCreate(dto)),
  update: (id: string, dto: UpdateListDTO) => store.update(id, dto),
  delete: store.delete,

  getItems: async (listId: string): Promise<ListItem[]> => {
    const list = await store.getById(listId);
    return list?.items ?? [];
  },

  addItem: async (listId: string, dto: CreateListItemDTO): Promise<List> => {
    const list = await store.getById(listId);
    if (!list) throw new Error(`List not found: ${listId}`);
    const now = new Date();
    const item: ListItem = {
      id: crypto.randomUUID(),
      title: dto.title,
      description: dto.description,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
    list.items.push(item);
    return store.update(listId, { items: list.items });
  },

  updateItem: async (
    listId: string,
    itemId: string,
    dto: UpdateListItemDTO,
  ): Promise<List> => {
    const list = await store.getById(listId);
    if (!list) throw new Error(`List not found: ${listId}`);
    const idx = list.items.findIndex((i) => i.id === itemId);
    if (idx === -1) throw new Error(`Item not found: ${itemId}`);
    list.items[idx] = { ...list.items[idx], ...dto, updatedAt: new Date() };
    return store.update(listId, { items: list.items });
  },

  deleteItem: async (listId: string, itemId: string): Promise<List> => {
    const list = await store.getById(listId);
    if (!list) throw new Error(`List not found: ${listId}`);
    list.items = list.items.filter((i) => i.id !== itemId);
    return store.update(listId, { items: list.items });
  },

  toggleItem: async (
    listId: string,
    itemId: string,
    completed: boolean,
  ): Promise<List> => {
    const list = await store.getById(listId);
    if (!list) throw new Error(`List not found: ${listId}`);
    const idx = list.items.findIndex((i) => i.id === itemId);
    if (idx === -1) throw new Error(`Item not found: ${itemId}`);
    list.items[idx] = { ...list.items[idx], completed, updatedAt: new Date() };
    return store.update(listId, { items: list.items });
  },
};

/**
 * Seeds the local store with a handful of example lists the first time
 * the app is used (i.e. when the store is empty). No-ops if any lists
 * already exist, so it never overwrites user data.
 */
export async function seedDefaultLists(): Promise<List[]> {
  const existing = await store.getAll();
  if (existing.length > 0) return existing;

  for (const seed of mockLists) {
    let list = await listsApi.create({
      title: seed.title,
      description: seed.description,
      type: seed.type,
      mode: seed.mode,
      icon: seed.icon,
      color: seed.color,
    });

    for (const item of seed.items) {
      list = await listsApi.addItem(list.id, { title: item.title });
    }

    const completedTitles = new Set(seed.items.filter((i) => i.completed).map((i) => i.title));
    for (const item of list.items) {
      if (completedTitles.has(item.title)) {
        list = await listsApi.toggleItem(list.id, item.id, true);
      }
    }
  }

  return store.getAll();
}
