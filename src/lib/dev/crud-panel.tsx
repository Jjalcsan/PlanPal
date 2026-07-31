"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, X, Check } from "lucide-react";

export interface CrudField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "checkbox";
  options?: { label: string; value: string }[];
  required?: boolean;
}

interface CrudPanelProps<T extends { id: string }> {
  title: string;
  storeKey: string;
  fields: CrudField[];
  items: T[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onCreate: (values: Record<string, string>) => Promise<void>;
  onUpdate: (id: string, values: Record<string, string>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  toValues: (item: T) => Record<string, string>;
  formatItem: (item: T) => string;
}

export function CrudPanel<T extends { id: string }>({
  title,
  storeKey,
  fields,
  items,
  loading,
  error,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
  toValues,
  formatItem,
}: CrudPanelProps<T>) {
  const [createValues, setCreateValues] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const emptyForm = () => {
    const init: Record<string, string> = {};
    fields.forEach((f) => {
      init[f.name] = f.type === "checkbox" ? "false" : "";
    });
    return init;
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      await onCreate(createValues);
      setCreateValues(emptyForm());
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = (item: T) => {
    setEditingId(item.id);
    setEditValues(toValues(item));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSaveEdit = async (id: string) => {
    await onUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const fieldValue = (
    values: Record<string, string>,
    setValues: (v: Record<string, string>) => void,
    field: CrudField,
  ) => {
    const val = values[field.name] ?? "";
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none ring-ring/50 focus-visible:border-ring focus-visible:ring-3"
            rows={2}
            placeholder={field.label}
            value={val}
            onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
          />
        );
      case "select":
        return (
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm outline-none ring-ring/50 focus-visible:border-ring focus-visible:ring-3"
            value={val}
            onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
          >
            <option value="">--</option>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        );
      case "date":
        return (
          <Input
            type="date"
            placeholder={field.label}
            value={val}
            onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
          />
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={val === "true"}
              onCheckedChange={(c) =>
                setValues({ ...values, [field.name]: c ? "true" : "false" })
              }
            />
            {field.label}
          </label>
        );
      default:
        return (
          <Input
            placeholder={field.label}
            value={val}
            onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              localStorage.removeItem(`planpal:${storeKey}`);
              onRefresh();
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-500 bg-red-50 p-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-lg border p-3">
        <h3 className="mb-2 text-sm font-medium">Create</h3>
        <div className="flex flex-col gap-2">
          {fields.map((f) => (
            <div key={f.name}>
              {f.type !== "checkbox" && (
                <label className="mb-0.5 block text-xs text-muted-foreground">{f.label}</label>
              )}
              {fieldValue(createValues, setCreateValues, f)}
            </div>
          ))}
          <Button size="sm" onClick={handleCreate} disabled={creating}>
            {creating ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 && !loading && (
          <p className="py-4 text-center text-sm text-muted-foreground">No items yet.</p>
        )}
        {items.map((item) => {
          const isEditing = editingId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-lg border p-3"
            >
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  {fields.map((f) => (
                    <div key={f.name}>
                      {f.type !== "checkbox" && (
                        <label className="mb-0.5 block text-xs text-muted-foreground">{f.label}</label>
                      )}
                      {fieldValue(editValues, setEditValues, f)}
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(item.id)}>
                      <Check className="size-3.5" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="size-3.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm flex-1 break-words min-w-0">{formatItem(item)}</span>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={() => handleStartEdit(item)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7 text-destructive"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}