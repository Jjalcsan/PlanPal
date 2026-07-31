"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Archive,
  ChevronRight,
  Clock,
  Filter,
  Heart,
  ListTodo,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { listsApi, seedDefaultLists } from "@/features/lists/api/lists";
import { CreateListModal } from "@/features/lists/components/CreateListModal";
import { EditListModal } from "@/features/lists/components/EditListModal";
import { colorOptions, iconOptions } from "@/features/lists/components/list-form-shared";
import type { List } from "@/features/lists/types/List";

interface StatBoxProps {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColorClass: string;
  bgColorClass: string;
}

function StatBox({ icon: Icon, label, value, iconColorClass, bgColorClass }: StatBoxProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-muted/50 py-4">
      <div className="flex items-center gap-2">
        <div className={`grid size-9 place-content-center rounded-full ${bgColorClass}`}>
          <Icon className={`size-4 ${iconColorClass}`} aria-hidden="true" />
        </div>
        <span className="text-xl font-semibold tracking-tight">{value}</span>
      </div>
      <span className="text-center text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

type ListFilter = "all" | "favourites" | "personal" | "work" | "shopping" | "filter";

const FILTER_LABELS: Record<ListFilter, string> = {
  all: "All",
  favourites: "Favourites",
  personal: "Personal",
  work: "Work",
  shopping: "Shopping",
  filter: "Filter",
};

interface ListTheme {
  icon: React.ElementType;
  color: string;
  bg: string;
}

function getListTheme(list: List): ListTheme {
  const iconOption = iconOptions.find((i) => i.name === list.icon);
  const colorOption = colorOptions.find((c) => c.name === list.color) ?? colorOptions[0];
  return {
    icon: iconOption?.icon ?? ListTodo,
    color: colorOption.text,
    bg: colorOption.soft,
  };
}

interface ListListItemProps {
  list: List;
  isFavourite: boolean;
  onToggleFavourite: (id: string) => void;
  onClick: (list: List) => void;
}

function ListListItem({ list, isFavourite, onToggleFavourite, onClick }: ListListItemProps) {
  const theme = getListTheme(list);
  const Icon = theme.icon;
  const isChecklist = list.mode === "checklist";
  const total = list.items.length;
  const completed = total > 0 ? list.items.filter((item) => item.completed).length : 0;
  const progress = isChecklist && total > 0 ? (completed / total) * 100 : 100;

  return (
    <li className="relative overflow-hidden rounded-2xl border">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-0"
        style={{ width: `${progress}%` }}
      >
        <div className={`h-full ${theme.bg}`} />
      </div>

      <button
        type="button"
        onClick={() => onClick(list)}
        className="relative z-10 flex w-full items-center gap-3 py-3 pl-4 pr-20 text-left"
      >
        <div className="grid size-10 shrink-0 place-content-center rounded-xl bg-transparent">
          <Icon className={`size-5 ${theme.color}`} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{list.title}</p>
          {list.description && (
            <p className="truncate text-xs text-muted-foreground">{list.description}</p>
          )}
        </div>
      </button>

      <div className="absolute inset-y-0 right-2 z-10 flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavourite(list.id);
          }}
          className={`rounded-full p-2 transition-colors ${
            isFavourite ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          }`}
          aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart className={`size-5 ${isFavourite ? "fill-current" : ""}`} />
        </button>
        <button
          type="button"
          onClick={() => onClick(list)}
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted/80"
          aria-label="Edit list"
        >
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

export default function ListsView() {
  const [lists, setLists] = useState<List[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ListFilter>("all");
  const [favourites, setFavourites] = useState<Set<string>>(new Set());
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingList, setEditingList] = useState<List | null>(null);

  useEffect(() => {
    seedDefaultLists().then((stored) => {
      setLists(stored);
    });
  }, []);

  const filteredLists = useMemo(() => {
    const term = search.trim().toLowerCase();
    return lists.filter((list) => {
      const matchesSearch =
        !term ||
        list.title.toLowerCase().includes(term) ||
        list.description?.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      switch (filter) {
        case "favourites":
          return favourites.has(list.id);
        case "personal":
          return list.type === "custom" || list.title.toLowerCase().includes("read") || list.title.toLowerCase().includes("travel");
        case "work":
          return list.title.toLowerCase().includes("work");
        case "shopping":
          return list.title.toLowerCase().includes("shop") || list.title.toLowerCase().includes("grocer");
        case "filter":
          return true;
        default:
          return true;
      }
    });
  }, [lists, search, filter, favourites]);

  const stats = useMemo(() => {
    const active = lists.filter((list) => {
      if (list.mode === "collection") return true;
      if (list.items.length === 0) return true;
      return list.items.some((item) => !item.completed);
    }).length;
    const recentCutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = lists.filter((list) => new Date(list.updatedAt).getTime() >= recentCutoff).length;
    const archived = 0;
    return {
      active: String(active),
      recent: String(recent),
      favourites: String(favourites.size),
      archived: String(archived),
    };
  }, [lists, favourites]);

  const toggleFavourite = (id: string) => {
    setFavourites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="px-4 pb-2 pt-4">
        <h1 className="text-2xl font-semibold">My lists</h1>
        <p className="text-sm text-muted-foreground">Organize yourself with lists that matter to you</p>
      </header>

      <button
        type="button"
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-20 right-4 z-40 grid size-12 place-content-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
        aria-label="Add list"
      >
        <Plus className="size-6" />
      </button>

      <CreateListModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={async (dto) => {
          const created = await listsApi.create({
            title: dto.title,
            description: dto.description,
            type: dto.type,
            mode: dto.mode,
            recurrence: dto.recurrence,
            icon: dto.icon,
            color: dto.color,
          });
          if (dto.checklist && dto.checklist.length > 0) {
            for (const item of dto.checklist) {
              const updated = await listsApi.addItem(created.id, { title: item.title });
              if (item.completed) {
                const added = updated.items[updated.items.length - 1];
                if (added) {
                  await listsApi.toggleItem(created.id, added.id, true);
                }
              }
            }
          }
          const refreshed = await listsApi.getAll();
          setLists(refreshed);
        }}
      />

      <EditListModal
        open={editingList !== null}
        list={editingList}
        onClose={() => setEditingList(null)}
        onSave={async (id, dto) => {
          await listsApi.update(id, {
            title: dto.title,
            description: dto.description,
            mode: dto.mode,
            icon: dto.icon,
            color: dto.color,
          });

          const original = lists.find((l) => l.id === id);
          const originalItems = original?.items ?? [];
          const nextItems = dto.checklist ?? [];
          const nextIds = new Set(nextItems.map((item) => item.id));

          for (const originalItem of originalItems) {
            if (!nextIds.has(originalItem.id)) {
              await listsApi.deleteItem(id, originalItem.id);
            }
          }
          for (const item of nextItems) {
            const existing = originalItems.find((i) => i.id === item.id);
            if (existing) {
              if (existing.title !== item.title || existing.completed !== item.completed) {
                await listsApi.updateItem(id, item.id, { title: item.title, completed: item.completed });
              }
            } else {
              const updated = await listsApi.addItem(id, { title: item.title });
              if (item.completed) {
                const added = updated.items[updated.items.length - 1];
                if (added) {
                  await listsApi.updateItem(id, added.id, { completed: true });
                }
              }
            }
          }

          const refreshed = await listsApi.getAll();
          setLists(refreshed);
        }}
        onDelete={async (id) => {
          await listsApi.delete(id);
          const refreshed = await listsApi.getAll();
          setLists(refreshed);
        }}
      />

      <main className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
        <section className="grid grid-cols-4 gap-3">
          <StatBox
            icon={ListTodo}
            label="Active lists"
            value={stats.active}
            iconColorClass="text-blue-700"
            bgColorClass="bg-blue-100"
          />
          <StatBox
            icon={Clock}
            label="Recent"
            value={stats.recent}
            iconColorClass="text-green-600"
            bgColorClass="bg-green-100"
          />
          <StatBox
            icon={Heart}
            label="Favourites"
            value={stats.favourites}
            iconColorClass="text-red-500"
            bgColorClass="bg-red-100"
          />
          <StatBox
            icon={Archive}
            label="Archived"
            value={stats.archived}
            iconColorClass="text-slate-600"
            bgColorClass="bg-slate-100"
          />
        </section>

        <section className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="text"
              placeholder="Search lists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(FILTER_LABELS) as ListFilter[]).map((key) => {
              const FilterIcon = key === "filter" ? Filter : undefined;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {FilterIcon && <FilterIcon className="size-3.5" />}
                  {FILTER_LABELS[key]}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          {filteredLists.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No lists found.</p>
          ) : (
            <ul className="space-y-3">
              {filteredLists.map((list) => (
                <ListListItem
                  key={list.id}
                  list={list}
                  isFavourite={favourites.has(list.id)}
                  onToggleFavourite={toggleFavourite}
                  onClick={setEditingList}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
