"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { AlignLeft, Bell, CalendarDays, Clock, Repeat, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { CreateCalendarEvent, CalendarEventTag } from "@/features/calendar/types/CalendarEvent";
import {
  DatePickerModal,
  TimePickerModal,
  SelectModal,
  NewTagModal,
  TagPickerModal,
  OptionRow,
  repeatOptions,
  reminderOptions,
  formatDateLabel,
  getNextHour,
} from "@/features/calendar/components/event-form-shared";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateCalendarEvent) => void;
  tags: CalendarEventTag[];
  onCreateTag: (tag: { name: string; color: string; dotColor?: string }) => Promise<CalendarEventTag>;
  defaultDate?: Date;
}

export function CreateEventModal({ open, onClose, onSave, tags, onCreateTag, defaultDate }: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>(defaultDate ?? new Date());
  const [allDay, setAllDay] = useState(false);
  const [time, setTime] = useState<string | null>(getNextHour());
  const [tag, setTag] = useState<CalendarEventTag | null>(tags[0] ?? null);
  const [repeat, setRepeat] = useState("Doesn't repeat");
  const [reminder, setReminder] = useState("None");
  const [notes, setNotes] = useState("");

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [newTagOpen, setNewTagOpen] = useState(false);
  const [repeatPickerOpen, setRepeatPickerOpen] = useState(false);
  const [reminderPickerOpen, setReminderPickerOpen] = useState(false);

  const MIN_HEIGHT = 45;
  const MAX_HEIGHT = 92;
  const START_HEIGHT = 75;

  const [height, setHeight] = useState(START_HEIGHT);
  const dragStartRef = React.useRef<{ y: number; height: number } | null>(null);

  const resetForm = () => {
    setTitle("");
    setDate(defaultDate ?? new Date());
    setAllDay(false);
    setTime(getNextHour());
    setTag(tags[0] ?? null);
    setRepeat("Doesn't repeat");
    setReminder("None");
    setNotes("");
  };

  useEffect(() => {
    if (open) {
      setHeight(START_HEIGHT);
      resetForm();
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    let startDate = new Date(date);
    if (!allDay && time) {
      const parsed = new Date(`2000-01-01 ${time}`);
      if (!Number.isNaN(parsed.getTime())) {
        startDate.setHours(parsed.getHours(), parsed.getMinutes(), 0, 0);
      }
    } else {
      startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    onSave({
      title: title.trim() || "Untitled event",
      description: notes || undefined,
      type: "event",
      tag: tag ?? undefined,
      startDate,
      allDay,
      recurrence:
        repeat !== "Doesn't repeat"
          ? {
              frequency: repeat.toLowerCase() as "daily" | "weekly" | "monthly" | "yearly",
            }
          : undefined,
      source: "manual",
    });
    onClose();
  };

  const handleCreateTag = async (draft: { name: string; color: string; dotColor?: string }) => {
    const created = await onCreateTag(draft);
    setTag(created);
  };

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
            <h2 className="text-2xl font-semibold">Add Event</h2>
            <p className="text-base text-muted-foreground">Create a new calendar event</p>
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
          <DatePickerModal
            open={datePickerOpen}
            value={date}
            onChange={setDate}
            onClose={() => setDatePickerOpen(false)}
          />
          <TimePickerModal
            open={timePickerOpen}
            value={time}
            onChange={setTime}
            onClose={() => setTimePickerOpen(false)}
          />
          <TagPickerModal
            open={tagPickerOpen}
            tags={tags}
            value={tag}
            onChange={setTag}
            onClose={() => setTagPickerOpen(false)}
            onAddNew={() => setNewTagOpen(true)}
          />
          <NewTagModal open={newTagOpen} onClose={() => setNewTagOpen(false)} onCreate={handleCreateTag} />
          <SelectModal
            open={repeatPickerOpen}
            title="Repeat"
            options={repeatOptions}
            value={repeat}
            onChange={setRepeat}
            onClose={() => setRepeatPickerOpen(false)}
          />
          <SelectModal
            open={reminderPickerOpen}
            title="Reminder"
            options={reminderOptions}
            value={reminder}
            onChange={setReminder}
            onClose={() => setReminderPickerOpen(false)}
          />

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <CalendarDays className="size-5" />
            </div>
            <Input
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 50))}
              className="pl-10 pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {title.length}/50
            </span>
          </div>

          <OptionRow
            icon={CalendarDays}
            label="Date"
            value={formatDateLabel(date)}
            iconColorClass="text-blue-600"
            onClick={() => setDatePickerOpen(true)}
          />

          <div className="flex w-full items-center justify-between gap-3 rounded-xl border p-3">
            <div className="flex flex-col">
              <span className="text-base font-semibold">All-day event</span>
              <span className="text-sm text-muted-foreground">This event lasts all day</span>
            </div>
            <Switch checked={allDay} onCheckedChange={setAllDay} aria-label="All-day event" />
          </div>

          {!allDay && (
            <OptionRow
              icon={Clock}
              label="Time"
              value={time ?? "No time"}
              iconColorClass="text-blue-600"
              onClick={() => setTimePickerOpen(true)}
            />
          )}

          <OptionRow
            icon={Tag}
            label="Category"
            value={tag?.name ?? "None"}
            iconColorClass="text-purple-600"
            valueColorClass={tag?.color}
            onClick={() => setTagPickerOpen(true)}
          />

          <OptionRow
            icon={Repeat}
            label="Repeat"
            value={repeat}
            iconColorClass="text-green-600"
            onClick={() => setRepeatPickerOpen(true)}
          />

          <OptionRow
            icon={Bell}
            label="Reminder"
            value={reminder}
            iconColorClass="text-orange-600"
            onClick={() => setReminderPickerOpen(true)}
          />

          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <AlignLeft className="size-5" />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 300))}
              placeholder="Notes (optional)"
              className="min-h-[96px] w-full rounded-md border border-input bg-transparent px-10 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              {notes.length}/300
            </span>
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-base font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              Save Event
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
