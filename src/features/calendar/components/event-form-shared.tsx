"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatTime } from "@/features/dashboard/lib/format";
import type { CalendarEventTag } from "@/features/calendar/types/CalendarEvent";

export const repeatOptions = [
  "Doesn't repeat",
  "Daily",
  "Weekly",
  "Monthly",
  "Yearly",
];

export const reminderOptions = [
  "None",
  "5 minutes before",
  "15 minutes before",
  "30 minutes before",
  "1 hour before",
  "1 day before",
];

export const tagColorOptions = [
  { name: "Blue", swatch: "bg-blue-500", pill: "bg-blue-100 text-blue-700" },
  { name: "Red", swatch: "bg-red-500", pill: "bg-red-100 text-red-700" },
  { name: "Green", swatch: "bg-emerald-500", pill: "bg-emerald-100 text-emerald-700" },
  { name: "Yellow", swatch: "bg-yellow-500", pill: "bg-yellow-100 text-yellow-700" },
  { name: "Purple", swatch: "bg-purple-500", pill: "bg-purple-100 text-purple-700" },
  { name: "Orange", swatch: "bg-orange-500", pill: "bg-orange-100 text-orange-700" },
  { name: "Pink", swatch: "bg-pink-500", pill: "bg-pink-100 text-pink-700" },
  { name: "Slate", swatch: "bg-slate-500", pill: "bg-slate-100 text-slate-700" },
];

export function formatDateLabel(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function formatTimeValue(hour: number, minute: number): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return formatTime(date);
}

export function getNextHour(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0);
  return formatTime(next);
}

interface DatePickerModalProps {
  open: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
}

export function DatePickerModal({ open, value, onChange, onClose }: DatePickerModalProps) {
  const [month, setMonth] = useState(value);

  useEffect(() => {
    if (open) setMonth(value);
  }, [open, value]);

  if (!open) return null;

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padded = Array.from({ length: firstDay }, () => null);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-background p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-sm font-semibold">{monthLabel}</span>
          <button
            type="button"
            onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Next month"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">{d[0]}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {padded.map((_, idx) => (
            <div key={`pad-${idx}`} />
          ))}
          {days.map((day) => {
            const date = new Date(year, monthIndex, day);
            const isSelected = value.toDateString() === date.toDateString();

            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  onChange(date);
                  onClose();
                }}
                className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                  isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface TimePickerModalProps {
  open: boolean;
  value: string | null;
  onChange: (time: string) => void;
  onClose: () => void;
}

export function TimePickerModal({ open, value, onChange, onClose }: TimePickerModalProps) {
  const safeValue = value ?? getNextHour();
  const baseDate = new Date(`2000-01-01T${safeValue}`);
  const parsedHour = Number.isNaN(baseDate.getTime()) ? new Date().getHours() + 1 : baseDate.getHours();
  const parsedMinute = Number.isNaN(baseDate.getTime()) ? 0 : baseDate.getMinutes();

  const [hour, setHour] = useState(parsedHour);
  const [minute, setMinute] = useState(parsedMinute);

  useEffect(() => {
    if (open) {
      setHour(parsedHour);
      setMinute(parsedMinute);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-4 shadow-xl">
        <h3 className="mb-4 text-center text-base font-semibold">Select time</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="mb-2 block text-center text-xs text-muted-foreground">Hour</span>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border p-1">
              {hours.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHour(h)}
                  className={`w-full rounded-lg px-2 py-1.5 text-sm ${
                    hour === h ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {String(h).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="mb-2 block text-center text-xs text-muted-foreground">Minute</span>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border p-1">
              {minutes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMinute(m)}
                  className={`w-full rounded-lg px-2 py-1.5 text-sm ${
                    minute === m ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  {String(m).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onChange(formatTimeValue(hour, minute));
            onClose();
          }}
          className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Done
        </button>
      </div>
    </div>
  );
}

interface SelectModalProps {
  open: boolean;
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function SelectModal({ open, title, options, value, onChange, onClose }: SelectModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-4 shadow-xl">
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>
        <div className="space-y-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                onClose();
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-base ${
                value === option ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted"
              }`}
            >
              {option}
              {value === option && <CheckCircle2 className="size-5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface NewTagModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (tag: { name: string; color: string; dotColor: string }) => void;
}

export function NewTagModal({ open, onClose, onCreate }: NewTagModalProps) {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(tagColorOptions[0]);

  useEffect(() => {
    if (open) {
      setName("");
      setSelectedColor(tagColorOptions[0]);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-4 shadow-xl">
        <h3 className="mb-3 text-base font-semibold">New tag</h3>
        <Input
          type="text"
          placeholder="Tag name"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          className="mb-4"
        />
        <div className="mb-4 grid grid-cols-4 gap-2">
          {tagColorOptions.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`grid size-10 place-content-center rounded-full ${color.swatch} ${
                selectedColor.name === color.name ? "ring-2 ring-offset-2 ring-primary" : ""
              }`}
              aria-label={color.name}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onCreate({ name: name.trim() || "Untitled", color: selectedColor.pill, dotColor: selectedColor.swatch });
              onClose();
            }}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

interface TagPickerModalProps {
  open: boolean;
  tags: CalendarEventTag[];
  value: CalendarEventTag | null;
  onChange: (tag: CalendarEventTag) => void;
  onClose: () => void;
  onAddNew: () => void;
}

export function TagPickerModal({ open, tags, value, onChange, onClose, onAddNew }: TagPickerModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-4 shadow-xl">
        <h3 className="mb-3 text-lg font-semibold">Category</h3>
        <div className="space-y-1">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => {
                onChange(tag);
                onClose();
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-base ${
                value?.id === tag.id ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted"
              }`}
            >
              <span className={`rounded-lg px-2.5 py-1 text-sm font-medium ${tag.color}`}>{tag.name}</span>
              {value?.id === tag.id && <CheckCircle2 className="size-5" />}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              onClose();
              onAddNew();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-base font-medium text-primary hover:bg-muted"
          >
            <Plus className="size-4" />
            Add new tag
          </button>
        </div>
      </div>
    </div>
  );
}

interface OptionRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColorClass?: string;
  valueColorClass?: string;
  onClick?: () => void;
}

export function OptionRow({
  icon: Icon,
  label,
  value,
  iconColorClass = "text-muted-foreground",
  valueColorClass,
  onClick,
}: OptionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex flex-1 items-center gap-3">
        <div className="grid size-10 place-content-center rounded-xl bg-transparent">
          <Icon className={`size-6 ${iconColorClass}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className={`text-base font-semibold ${valueColorClass ?? "text-foreground"}`}>{value}</span>
        </div>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
    </button>
  );
}
