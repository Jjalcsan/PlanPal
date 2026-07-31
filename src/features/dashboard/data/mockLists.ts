import type { List } from "@/features/lists/types/List";

export const mockLists: List[] = [
  {
    id: "list-1",
    title: "Groceries",
    description: "Weekly grocery shopping",
    type: "task",
    mode: "checklist",
    items: [
      { id: "li-1", title: "Milk", completed: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-2", title: "Eggs", completed: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-3", title: "Bread", completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-4", title: "Vegetables", completed: false, createdAt: new Date(), updatedAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "list-2",
    title: "Workout routine",
    description: "Daily exercises",
    type: "habit",
    mode: "checklist",
    items: [
      { id: "li-5", title: "Push-ups", completed: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-6", title: "Squats", completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-7", title: "Plank", completed: false, createdAt: new Date(), updatedAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "list-3",
    title: "Reading list",
    description: "Books to read this quarter",
    type: "custom",
    mode: "collection",
    items: [
      { id: "li-8", title: "Atomic Habits", completed: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-9", title: "Deep Work", completed: true, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-10", title: "The Pragmatic Programmer", completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-11", title: "Clean Code", completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-12", title: "Design Patterns", completed: false, createdAt: new Date(), updatedAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "list-4",
    title: "Home repairs",
    description: "Pending home maintenance",
    type: "task",
    mode: "checklist",
    items: [
      { id: "li-13", title: "Fix leaky faucet", completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: "li-14", title: "Replace air filter", completed: false, createdAt: new Date(), updatedAt: new Date() },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
