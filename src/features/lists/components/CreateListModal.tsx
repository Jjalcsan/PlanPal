"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { AlignLeft, CheckCircle2, List as ListIcon, ListChecks, Plus, Repeat, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CreateListDTO } from "@/features/lists/api/lists";
import {
  type ChecklistItemDraft,
  ColorPickerModal,
  IconPickerModal,
  OptionRow,
  SelectModal,
  colorOptions,
  iconOptions,
  repeatOptions,
} from "@/features/lists/components/list-form-shared";

interface CreateListModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateListDTO & { checklist?: { title: string; completed: boolean }[] }) => void;
}

export function CreateListModal({ open, onClose, onSave }: CreateListModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [listMode, setListMode] = useState<"checklist" | "collection">("checklist");
  const [checklist, setChecklist] = useState<ChecklistItemDraft[]>([]);
  const [repeat, setRepeat] = useState("Doesn't repeat");
  const [selectedIcon, setSelectedIcon] = useState("List");
  const [selectedColor, setSelectedColor] = useState("Blue");

  const [repeatPickerOpen, setRepeatPickerOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const MIN_HEIGHT = 45;
  const MAX_HEIGHT = 92;
  const START_HEIGHT = 75;

  const [height, setHeight] = useState(START_HEIGHT);
  const dragStartRef = React.useRef<{ y: number; height: number } | null>(null);

  useEffect(() => {
    if (open) {
      setHeight(START_HEIGHT);
      resetForm();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = { y: e.clientY, height };
    (e.target as Element).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const delta = dragStartRef.current.y - e.clientY;
    const vhDelta = (delta / window.innerHeight) * 100;
    const next = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, dragStartRef.current.height + vhDelta));
    setHeight(next);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    if (height < MIN_HEIGHT + 12) {
      onClose();
    } else if (height > MAX_HEIGHT - 12) {
      setHeight(MAX_HEIGHT);
    } else if (height < START_HEIGHT - 12) {
      setHeight(MIN_HEIGHT);
    } else {
      setHeight(START_HEIGHT);
    }
    dragStartRef.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  };

  const handleSave = () => {
    onSave({
      title: title.trim() || "Untitled list",
      description: description || undefined,
      type: "custom",
      mode: listMode,
      checklist:
        checklist.length > 0
          ? checklist.map((item) => ({ title: item.title, completed: item.completed }))
          : undefined,
      color: selectedColor,
      icon: selectedIcon,
    });
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setListMode("checklist");
    setChecklist([]);
    setRepeat("Doesn't repeat");
    setSelectedIcon("List");
    setSelectedColor("Blue");
  };

  const addChecklistItem = () => {
    setChecklist((prev) => [...prev, { id: crypto.randomUUID(), title: "", completed: false }]);
  };

  const updateChecklistItem = (id: string, title: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, title } : item)));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    );
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const selectedColorOption = colorOptions.find((c) => c.name === selectedColor) ?? colorOptions[0];
  const selectedIconOption = iconOptions.find((i) => i.name === selectedIcon) ?? iconOptions[0];
  const SelectedIcon = selectedIconOption.icon;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        className="relative z-10 flex w-full max-w-2xl flex-col self-center rounded-t-3xl bg-background px-4 pb-6 pt-2 shadow-xl transition-all duration-150 ease-out"
        style={{ height: `${height}vh`, maxHeight: `${MAX_HEIGHT}vh` }}
      >
        <div
          role="button"
          tabIndex={0}
          aria-label="Drag to resize"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="mx-auto mb-2 flex h-6 w-16 cursor-grab touch-none items-center justify-center rounded-full active:cursor-grabbing"
        >
          <div className="h-1.5 w-12 rounded-full bg-muted" />
        </div>

        <div className="mb-4 flex shrink-0 items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Create new list</h2>
            <p className="text-base text-muted-foreground">
              Create a list to organize your tasks and keep everything in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-content-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain pr-1 pb-24">
          <SelectModal
            open={repeatPickerOpen}
            title="Repeat"
            options={repeatOptions}
            value={repeat}
            onChange={setRepeat}
            onClose={() => setRepeatPickerOpen(false)}
          />
          <IconPickerModal
            open={iconPickerOpen}
            selected={selectedIcon}
            onSelect={setSelectedIcon}
            onClose={() => setIconPickerOpen(false)}
          />
          <ColorPickerModal
            open={colorPickerOpen}
            selected={selectedColor}
            onSelect={setSelectedColor}
            onClose={() => setColorPickerOpen(false)}
          />

          <div className="relative">
            <Input
              type="text"
              placeholder="List name"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))}
              className="pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {title.length}/50
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <AlignLeft className="size-5" />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 200))}
              placeholder="Description (optional)"
              className="min-h-[96px] w-full rounded-md border border-input bg-transparent px-10 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              {description.length}/200
            </span>
          </div>

          <div className="rounded-2xl border p-3">
            <p className="mb-2 text-sm font-semibold">List type</p>
            <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
              <button
                type="button"
                onClick={() => setListMode("collection")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                  listMode === "collection" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              >
                <ListIcon className="size-4" />
                Simple list
              </button>
              <button
                type="button"
                onClick={() => setListMode("checklist")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                  listMode === "checklist" ? "bg-background shadow-sm" : "text-muted-foreground"
                }`}
              >
                <ListChecks className="size-4" />
                Checklist
              </button>
            </div>
          </div>

          <div className="rounded-2xl border">
            <button
              type="button"
              onClick={addChecklistItem}
              className="flex w-full items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-content-center rounded-xl bg-transparent">
                  <ListChecks className="size-6 text-blue-600" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-base font-semibold">
                    {listMode === "checklist" ? "Checklist items" : "List items"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {checklist.length === 0 ? "Add items to your list" : `${checklist.length} item(s)`}
                  </span>
                </div>
              </div>
              <Plus className="size-5 text-muted-foreground" />
            </button>
            {checklist.length > 0 && (
              <div className="border-t px-4 py-3">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-2">
                    {listMode === "checklist" && (
                      <button
                        type="button"
                        onClick={() => toggleChecklistItem(item.id)}
                        className={`flex size-5 shrink-0 items-center justify-center rounded border ${
                          item.completed ? "bg-primary text-primary-foreground" : "bg-background"
                        }`}
                        aria-label={item.completed ? "Mark item as not completed" : "Mark item as completed"}
                      >
                        {item.completed && <CheckCircle2 className="size-3.5" />}
                      </button>
                    )}
                    <Input
                      type="text"
                      placeholder="Item title"
                      value={item.title}
                      onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                      className={`h-8 flex-1 text-sm ${listMode === "checklist" && item.completed ? "text-muted-foreground line-through" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remove item"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <OptionRow
            label="Icon"
            subtitle="Choose an icon for your list"
            right={<SelectedIcon className="size-5 text-muted-foreground" />}
            onClick={() => setIconPickerOpen(true)}
          />

          <OptionRow
            label="Color"
            subtitle="Choose a color to identify your list"
            right={<div className={`size-6 rounded-full ${selectedColorOption.bg}`} />}
            onClick={() => setColorPickerOpen(true)}
          />

          <div className="space-y-3">
            <OptionRow
              icon={Repeat}
              iconColorClass="text-green-600"
              label="Repeat"
              subtitle="Set a repeat timer to refresh the list"
              right={<span className="text-sm text-muted-foreground">{repeat}</span>}
              onClick={() => setRepeatPickerOpen(true)}
            />
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-base font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              Create list
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border py-3.5 text-base font-semibold transition-colors hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
