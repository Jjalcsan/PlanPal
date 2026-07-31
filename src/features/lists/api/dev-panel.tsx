"use client";

import { useState, useEffect, useCallback } from "react";
import { CrudPanel, type CrudField } from "@/lib/dev/crud-panel";
import { listsApi } from "@/features/lists/api/lists";
import type { List } from "@/features/lists/types/List";
import type { ListType, ListMode } from "@/features/lists/types/List";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

const TYPE_OPTIONS: { label: string; value: string }[] = [
  "task", "object", "habit", "custom",
].map((t) => ({ label: t, value: t }));

const MODE_OPTIONS: { label: string; value: string }[] = [
  { label: "checklist", value: "checklist" },
  { label: "collection", value: "collection" },
];

const FIELDS: CrudField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "type", label: "Type", type: "select", options: TYPE_OPTIONS },
  { name: "mode", label: "Mode", type: "select", options: MODE_OPTIONS },
  { name: "description", label: "Description", type: "textarea" },
];

export function ListsDevPanel() {
  const [items, setItems] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedList, setExpandedList] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listsApi.getAll();
      setItems(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const toValues = (l: List) => ({
    title: l.title,
    type: l.type,
    mode: l.mode,
    description: l.description ?? "",
  });

  const formatItem = (l: List) =>
    `${l.title} (${l.type}, ${l.mode}) — ${l.items.length} items`;

  const onCreate = async (vals: Record<string, string>) => {
    await listsApi.create({
      title: vals.title,
      type: vals.type as ListType || "task",
      mode: vals.mode as ListMode || "checklist",
      description: vals.description || undefined,
    });
    await load();
  };

  const onUpdate = async (id: string, vals: Record<string, string>) => {
    await listsApi.update(id, {
      title: vals.title,
      type: vals.type as ListType || "task",
      mode: vals.mode as ListMode || "checklist",
      description: vals.description || undefined,
    });
    await load();
  };

  const onDelete = async (id: string) => {
    await listsApi.delete(id);
    if (expandedList === id) setExpandedList(null);
    await load();
  };

  const [itemTitle, setItemTitle] = useState("");

  const addItem = async (listId: string) => {
    if (!itemTitle.trim()) return;
    await listsApi.addItem(listId, { title: itemTitle.trim() });
    setItemTitle("");
    await load();
  };

  const toggleItem = async (listId: string, itemId: string, completed: boolean) => {
    await listsApi.toggleItem(listId, itemId, completed);
    await load();
  };

  const deleteItem = async (listId: string, itemId: string) => {
    await listsApi.deleteItem(listId, itemId);
    await load();
  };

  return (
    <div className="flex flex-col gap-4">
      <CrudPanel
        title="Lists"
        storeKey="lists"
        fields={FIELDS}
        items={items}
        loading={loading}
        error={error}
        onRefresh={load}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
        toValues={toValues}
        formatItem={formatItem}
      />

      {items.length > 0 && (
        <div className="rounded-lg border p-3">
          <h3 className="mb-2 text-sm font-medium">List Items</h3>
          <select
            className="mb-3 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
            value={expandedList ?? ""}
            onChange={(e) => setExpandedList(e.target.value || null)}
          >
            <option value="">Select a list...</option>
            {items.map((l) => (
              <option key={l.id} value={l.id}>{l.title}</option>
            ))}
          </select>

          {expandedList && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  placeholder="New item title"
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addItem(expandedList)}
                />
                <Button size="sm" onClick={() => addItem(expandedList)}>Add</Button>
              </div>

              {(() => {
                const list = items.find((l) => l.id === expandedList);
                if (!list) return null;
                return list.items.length === 0 ? (
                  <p className="py-2 text-center text-xs text-muted-foreground">No items.</p>
                ) : (
                  list.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2 rounded border px-3 py-2">
                      <label className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={(c) => toggleItem(list.id, item.id, !!c)}
                        />
                        <span className={item.completed ? "line-through text-muted-foreground" : ""}>
                          {item.title}
                        </span>
                      </label>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-7 text-destructive"
                        onClick={() => deleteItem(list.id, item.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  ))
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}