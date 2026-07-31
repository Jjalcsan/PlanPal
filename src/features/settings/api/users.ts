/**
 * Users API — local persistence layer.
 *
 * @remarks
 * Uses localStorage via createLocalStore for local-only CRUD.
 * Replace this file with REST API calls when a backend is available.
 * The public interface (usersApi) stays the same.
 */

import { createLocalStore } from "@/lib/local-store";
import type { User, CreateUser, UpdateUser } from "@/features/settings/types/User";

function toCreate(dto: CreateUser): Omit<User, "id"> {
  return {
    name: dto.name,
    avatarUrl: dto.avatarUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const store = createLocalStore<User>("users");

export const usersApi = {
  getAll: store.getAll,
  getById: store.getById,
  create: (dto: CreateUser) => store.create(toCreate(dto)),
  update: (id: string, dto: UpdateUser) => store.update(id, dto),
  delete: store.delete,
};