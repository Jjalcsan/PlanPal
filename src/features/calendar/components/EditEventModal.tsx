"use client";

import { useEffect, useState } from "react";
import { AlignLeft, ArrowLeft, Bell, CalendarDays, Clock, Repeat, Tag, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { CalendarEvent, CalendarEventTag, UpdateCalendarEvent } from "@/features/calendar/types/CalendarEvent";
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
} from "@/features/calendar/components/event-form-shared";
import { formatTime } from "@/features/dashboard/lib/format";

function recurrenceToRepeat(event: CalendarEvent): string {
  if (!event.recurrence) return "Doesn't repeat";
  const frequency = event.recurrence.frequency;
  return frequency.charAt(0).toUpperCase() + frequency.slice(1);
}

interface EditEventModalProps {
  open: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onSave: (id: string, dto: UpdateCalendarEvent) => void;
  onDelete: (id: string) => void;
  tags: CalendarEventTag[];
  onCreateTag: (tag: { name: string; color: string; dotColor?: string }) => Promise<CalendarEventTag>;
}

export function EditEventModal({ open, event, onClose, onSave, onDelete, tags, onCreateTag }: EditEventModalProps) {
  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [allDay, setAllDay] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const [tag, setTag] = useState<CalendarEventTag | null>(null);
  const [repeat, setRepeat] = useState("Doesn't repeat");
  const [reminder, setReminder] = useState("None");
  const [notes, setNotes] = useState("");

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [newTagOpen, setNewTagOpen] = useState(false);
  const [repeatPickerOpen, setRepeatPickerOpen] = useState(false);
  const [reminderPickerOpen, setReminderPickerOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    if (open && event) {
      setTitle(event.title);
      setDate(event.startDate);
      setAllDay(event.allDay);
      setTime(event.allDay ? null : formatTime(event.startDate));
      setTag(event.tag ?? null);
      setRepeat(recurrenceToRepeat(event));
      setReminder("None");
      setNotes(event.description ?? "");
      setConfirmDeleteOpen(false);
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => setVisible(true), 10);
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
    setVisible(false);
  }, [open, event]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSave = () => {
    if (!event) return;
    let startDate = new Date(date);
    if (!allDay && time) {
      const parsed = new Date(`2000-01-01 ${time}`);
      if (!Number.isNaN(parsed.getTime())) {
        startDate.setHours(parsed.getHours(), parsed.getMinutes(), 0, 0);
      }
    } else {
      startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    onSave(event.id, {
      title: title.trim() || "Untitled event",
      description: notes || undefined,
      tag: tag ?? undefined,
      startDate,
      allDay,
      recurrence:
        repeat !== "Doesn't repeat"
          ? { frequency: repeat.toLowerCase() as "daily" | "weekly" | "monthly" | "yearly" }
          : undefined,
    });
    handleClose();
  };

  const handleDelete = () => {
    if (!event) return;
    onDelete(event.id);
    handleClose();
  };

  const handleCreateTag = async (draft: { name: string; color: string; dotColor?: string }) => {
    const created = await onCreateTag(draft);
    setTag(created);
  };

  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/20" onClick={handleClose} />
      <div
        className={`absolute inset-y-0 right-0 flex w-full flex-col bg-background shadow-2xl transition-transform duration-200 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center gap-3 border-b px-4 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="grid size-10 place-content-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h2 className="text-lg font-semibold">Edit event</h2>
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-5">
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

          {confirmDeleteOpen && (
            <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
              <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmDeleteOpen(false)} />
              <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-5 shadow-xl">
                <h3 className="mb-2 text-lg font-semibold">Delete event?</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  This will permanently delete &ldquo;{event.title}&rdquo;.
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full rounded-xl bg-destructive py-3 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteOpen(false)}
                    className="w-full rounded-xl border py-3 text-sm font-semibold transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

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
              Accept
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-xl border py-3.5 text-base font-semibold transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-base font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="size-5" />
              Delete event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
