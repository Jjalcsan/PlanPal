"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AlignLeft,
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Filter,
  Flag,
  Inbox,
  ListChecks,
  Plus,
  Repeat,
  Search,
  Sun,
  Tag,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { tasksApi } from "@/features/tasks/api/tasks";
import { formatTime, formatWeekday } from "@/features/dashboard/lib/format";
import type { Task, TaskTag, ChecklistItem, TaskPriority, CreateTask } from "@/features/tasks/types/Task";

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

type TaskFilter = "all" | "today" | "upcoming" | "completed" | "high-priority";

const FILTER_LABELS: Record<TaskFilter, string> = {
  all: "All",
  today: "Today",
  upcoming: "Upcoming",
  completed: "Completed",
  "high-priority": "High Priority",
};

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

interface TaskGroup {
  key: string;
  icon: React.ElementType;
  label: string;
  tasks: Task[];
  badgeClassName?: string;
}

function getTaskGroups(tasks: Task[], filter: TaskFilter): TaskGroup[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrowStart = addDays(todayStart, 1);

  switch (filter) {
    case "all": {
      const dueTasks = tasks.filter(
        (t) => t.dueDate && t.dueDate < todayStart && t.status !== "done" && t.status !== "cancelled",
      );
      const groups: TaskGroup[] = [];
      if (dueTasks.length > 0) {
        groups.push({
          key: "due",
          icon: TriangleAlert,
          label: "Due",
          tasks: dueTasks,
          badgeClassName: "bg-red-500 text-white",
        });
      }
      groups.push(
        {
          key: "today",
          icon: Sun,
          label: "Today",
          tasks: tasks.filter(
            (t) => t.dueDate && isSameDay(t.dueDate, todayStart) && t.status !== "done" && t.status !== "cancelled",
          ),
        },
        {
          key: "tomorrow",
          icon: Clock,
          label: "Tomorrow",
          tasks: tasks.filter(
            (t) => t.dueDate && isSameDay(t.dueDate, tomorrowStart) && t.status !== "done" && t.status !== "cancelled",
          ),
        },
        {
          key: "upcoming",
          icon: CalendarDays,
          label: "Upcoming",
          tasks: tasks.filter(
            (t) => t.dueDate && t.dueDate > tomorrowStart && t.status !== "done" && t.status !== "cancelled",
          ),
        },
        {
          key: "completed",
          icon: CheckCircle2,
          label: "Completed",
          tasks: tasks.filter((t) => t.status === "done" || t.status === "cancelled"),
        },
      );
      return groups;
    }
    case "today":
      return [
        {
          key: "today",
          icon: Clock,
          label: "Today",
          tasks: tasks.filter(
            (t) => t.dueDate && isSameDay(t.dueDate, todayStart) && t.status !== "done" && t.status !== "cancelled",
          ),
        },
      ];
    case "upcoming":
      return [
        {
          key: "upcoming",
          icon: Filter,
          label: "Upcoming",
          tasks: tasks.filter(
            (t) => t.dueDate && t.dueDate >= tomorrowStart && t.status !== "done" && t.status !== "cancelled",
          ),
        },
      ];
    case "completed":
      return [
        {
          key: "completed",
          icon: CheckCircle2,
          label: "Completed",
          tasks: tasks.filter((t) => t.status === "done" || t.status === "cancelled"),
        },
      ];
    case "high-priority":
      return [
        {
          key: "high-priority",
          icon: TriangleAlert,
          label: "High Priority",
          tasks: tasks.filter((t) => t.priority === "high" || t.priority === "critical"),
        },
      ];
  }
}

interface TaskGroupSectionProps {
  group: TaskGroup;
  defaultExpanded?: boolean;
  onTaskClick?: (task: Task) => void;
  onTaskToggle?: (task: Task) => void;
  onTaskDelete?: (task: Task) => void;
}

function priorityBorderColor(task: Task): string {
  switch (task.priority) {
    case "critical":
      return "border-l-red-500";
    case "high":
      return "border-l-orange-500";
    case "medium":
      return "border-l-yellow-500";
    default:
      return "border-l-blue-400";
  }
}

function displayPriority(priority: TaskPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function taskPriorityStyle(priority: TaskPriority): { bg: string; text: string } {
  return priorityStyle(displayPriority(priority));
}

function formatTaskDueDate(dueDate: Date, today: Date): string {
  if (isSameDay(dueDate, today)) {
    return formatTime(dueDate);
  }
  return `${formatWeekday(dueDate)}, ${dueDate.getDate()} ${formatTime(dueDate)}`;
}

function formatCompletedDueDate(dueDate: Date, today: Date): string {
  if (isSameDay(dueDate, today)) {
    return formatTime(dueDate);
  }
  if (dueDate >= today) {
    return `${formatWeekday(dueDate)}, ${dueDate.getDate()} ${formatTime(dueDate)}`;
  }
  return dueDate.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

interface TaskItemProps {
  task: Task;
  completed?: boolean;
  onClick?: () => void;
  onToggle?: () => void;
  onDelete?: () => void;
}

function TaskItem({ task, completed = false, onClick, onToggle, onDelete }: TaskItemProps) {
  const today = new Date();

  return (
    <li
      key={task.id}
      className={`flex cursor-pointer items-center gap-3 border-b border-l-4 py-3 pr-3 pl-3 last:rounded-bl-2xl last:border-b-0 ${completed ? "border-l-transparent" : priorityBorderColor(task)}`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`flex size-5 shrink-0 items-center justify-center rounded ${
          task.status === "done" ? "bg-blue-600 text-white" : "border bg-background"
        }`}
        aria-label={task.status === "done" ? "Mark as not done" : "Mark as done"}
      >
        {task.status === "done" && <Check className="size-3.5" />}
      </button>
      <button
        type="button"
        onClick={onClick}
        className="flex min-w-0 flex-1 flex-col items-start text-left"
      >
        <p className="truncate text-sm font-medium">{task.title}</p>
        {task.description && (
          <p className="truncate text-xs text-muted-foreground">{task.description}</p>
        )}
      </button>
      <button
        type="button"
        onClick={completed ? onDelete : onClick}
        className="flex shrink-0 items-center gap-3"
      >
        {!completed && task.tag && (
          <span className={`rounded px-2 py-0.5 text-[10px] font-medium ${task.tag.color}`}>
            {task.tag.name}
          </span>
        )}
        {task.dueDate && (
          <span className="text-xs text-muted-foreground">
            {completed ? formatCompletedDueDate(task.dueDate, today) : formatTaskDueDate(task.dueDate, today)}
          </span>
        )}
        <div className="flex items-center gap-2">
          {task.repeat && task.repeat !== "Doesn't repeat" && (
            <Clock className="size-4 text-muted-foreground" aria-label="Repeating task" />
          )}
          {completed ? (
            <X className="size-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </button>
    </li>
  );
}

const priorityOptions = ["Low", "Medium", "High", "Critical"];

const categoryOptions = ["Work", "Health", "Personal"] as const;
type CategoryName = (typeof categoryOptions)[number];

const categoryTags: Record<CategoryName, { name: CategoryName; color: string; bg: string; text: string }> = {
  Work: { name: "Work", color: "bg-blue-100 text-blue-700", bg: "bg-blue-100", text: "text-blue-700" },
  Health: { name: "Health", color: "bg-cyan-100 text-cyan-700", bg: "bg-cyan-100", text: "text-cyan-700" },
  Personal: { name: "Personal", color: "bg-green-100 text-green-700", bg: "bg-green-100", text: "text-green-700" },
};

function tagFromCategory(name: CategoryName): TaskTag {
  return {
    id: `tag-${name.toLowerCase()}`,
    name,
    color: categoryTags[name].color,
  };
}

const prioritySelectOptions = ["Low", "Medium", "High", "Critical"];
const repeatOptions = [
  "Doesn't repeat",
  "1 day",
  "2 days",
  "1 week",
  "2 weeks",
  "monthly",
  "Semestral",
  "yearly",
];
const reminderOptions = ["None", "5 minutes before", "15 minutes before", "30 minutes before", "1 hour before", "1 day before"];

function formatDateLabel(date: Date | null): string {
  if (!date) return "No due date";
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

function formatTimeValue(hour: number, minute: number): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return formatTime(date);
}

function getNextHour(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0);
  return formatTime(next);
}

interface TimePickerModalProps {
  value: string | null;
  onChange: (time: string | null) => void;
  onClose: () => void;
  open: boolean;
}

function TimePickerModal({ value, onChange, onClose, open }: TimePickerModalProps) {
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

function priorityStyle(option: string): { color: string; bg: string; text: string } {
  switch (option) {
    case "Low":
      return { color: "bg-blue-100 text-blue-700", bg: "bg-blue-100", text: "text-blue-700" };
    case "Medium":
      return { color: "bg-yellow-100 text-yellow-700", bg: "bg-yellow-100", text: "text-yellow-700" };
    case "High":
      return { color: "bg-orange-100 text-orange-700", bg: "bg-orange-100", text: "text-orange-700" };
    case "Critical":
      return { color: "bg-red-100 text-red-700", bg: "bg-red-100", text: "text-red-700" };
    default:
      return { color: "bg-muted text-muted-foreground", bg: "bg-muted", text: "text-muted-foreground" };
  }
}

function priorityColor(option: string): string {
  return priorityStyle(option).color;
}

function SelectModal({ open, title, options, value, onChange, onClose }: SelectModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-4 shadow-xl">
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>
        <div className="space-y-1">
          {options.map((option) => {
            const isTag = title === "Category" && categoryTags[option as CategoryName];
            const isPriority = title === "Priority";
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-base ${
                  value === option
                    ? "bg-primary/10 font-medium text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <span className="flex items-center gap-2">
                  {isTag && (
                    <span className={`rounded-lg px-2.5 py-1 text-sm font-medium ${categoryTags[option as CategoryName].color}`}>
                      {categoryTags[option as CategoryName].name}
                    </span>
                  )}
                  {isPriority && (
                    <span className={`rounded-lg px-2.5 py-1 text-sm font-medium ${priorityColor(option)}`}>
                      {option}
                    </span>
                  )}
                  {!isTag && !isPriority && option}
                </span>
                {value === option && <CheckCircle2 className="size-5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface TagModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (tag: { name: string; color: string }) => void;
}

const tagColorOptions = [
  { name: "Blue", bg: "bg-blue-500" },
  { name: "Red", bg: "bg-red-500" },
  { name: "Green", bg: "bg-green-500" },
  { name: "Yellow", bg: "bg-yellow-500" },
  { name: "Purple", bg: "bg-purple-500" },
  { name: "Orange", bg: "bg-orange-500" },
  { name: "Pink", bg: "bg-pink-500" },
  { name: "Slate", bg: "bg-slate-500" },
];

function TagModal({ open, onClose, onSelect }: TagModalProps) {
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
              className={`grid size-10 place-content-center rounded-full ${color.bg} ${
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
              onSelect({ name: name.trim() || "Untitled", color: selectedColor.bg });
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

interface DatePickerModalProps {
  value: Date | null;
  onChange: (date: Date) => void;
  onClose: () => void;
  open: boolean;
}

function DatePickerModal({ value, onChange, onClose, open }: DatePickerModalProps) {
  const [month, setMonth] = useState(value ?? new Date());

  useEffect(() => {
    if (open) setMonth(value ?? new Date());
  }, [open, value]);

  if (!open) return null;

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const prevMonth = () => setMonth(new Date(year, monthIndex - 1, 1));
  const nextMonth = () => setMonth(new Date(year, monthIndex + 1, 1));

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padded = Array.from({ length: firstDay }, () => null);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-background p-4 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="text-sm font-semibold">{monthLabel}</span>
          <button
            type="button"
            onClick={nextMonth}
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
            const isDisabled = date < today;
            const isSelected = value?.toDateString() === date.toDateString();

            return (
              <button
                key={day}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  onChange(date);
                  onClose();
                }}
                className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : isDisabled
                      ? "text-muted-foreground/40"
                      : "hover:bg-muted"
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

interface OptionRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  onClick?: () => void;
  action?: "dropdown" | "clear";
  iconColorClass?: string;
  iconBgClass?: string;
  valueColorClass?: string;
}

function optionBadge(value: string, colorClass: string | undefined, label: string): React.ReactNode {
  if (label === "Priority") {
    const style = priorityStyle(value);
    return <span className={`inline-block rounded-lg px-2.5 py-0.5 text-sm font-semibold ${style.bg} ${style.text}`}>{value}</span>;
  }
  if (label === "Category" && categoryTags[value as CategoryName]) {
    const tag = categoryTags[value as CategoryName];
    return <span className={`inline-block rounded-lg px-2.5 py-0.5 text-sm font-semibold ${tag.bg} ${tag.text}`}>{tag.name}</span>;
  }
  if (label === "Category" && colorClass) {
    return <span className={`inline-block rounded-lg px-2.5 py-0.5 text-sm font-semibold ${colorClass}`}>{value}</span>;
  }
  return <span className={`text-base font-semibold ${colorClass ?? "text-foreground"}`}>{value}</span>;
}

function OptionRow({
  icon: Icon,
  label,
  value,
  onClick,
  onClear,
  action = "dropdown",
  iconColorClass = "text-muted-foreground",
  iconBgClass,
  valueColorClass,
}: OptionRowProps & { onClear?: () => void }) {
  return (
    <div className="flex w-full items-center justify-between gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50">
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <div className={`grid size-10 place-content-center rounded-xl ${iconBgClass ?? "bg-transparent"}`}>
          <Icon className={`size-6 ${iconColorClass}`} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">{label}</span>
          {optionBadge(value, valueColorClass, label)}
        </div>
      </button>
      {action === "dropdown" ? (
        <button type="button" onClick={onClick} className="shrink-0 p-1">
          <ChevronRight className="size-5 text-muted-foreground transition-transform" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-destructive"
          aria-label={`Clear ${label}`}
        >
          <X className="size-5" />
        </button>
      )}
    </div>
  );
}

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<CreateTask, "id">) => void;
}

function CreateTaskModal({ open, onClose, onSave }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [priority, setPriority] = useState("Medium");
  const [repeat, setRepeat] = useState("Doesn't repeat");
  const [time, setTime] = useState<string | null>(getNextHour());
  const [category, setCategory] = useState<CategoryName>(
    categoryOptions[Math.floor(Math.random() * categoryOptions.length)],
  );
  const [reminder, setReminder] = useState("None");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [priorityPickerOpen, setPriorityPickerOpen] = useState(false);
  const [repeatPickerOpen, setRepeatPickerOpen] = useState(false);
  const [reminderPickerOpen, setReminderPickerOpen] = useState(false);
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [customTag, setCustomTag] = useState<{ name: string; color: string } | null>(null);

  interface ChecklistItemDraft {
    id: string;
    title: string;
    completed: boolean;
  }

  const [checklistExpanded, setChecklistExpanded] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItemDraft[]>([]);

  const addChecklistItem = () => {
    setChecklist((prev) => [...prev, { id: crypto.randomUUID(), title: "", completed: false }]);
  };

  const updateChecklistItem = (id: string, title: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, title } : item)));
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const MIN_HEIGHT = 45;
  const MAX_HEIGHT = 92;
  const START_HEIGHT = 75;

  const [height, setHeight] = useState(START_HEIGHT);
  const contentRef = React.useRef<HTMLDivElement>(null);
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
    let finalDueDate = dueDate;
    if (finalDueDate && time) {
      const parsed = new Date(`2000-01-01 ${time}`);
      if (!Number.isNaN(parsed.getTime())) {
        finalDueDate = new Date(finalDueDate);
        finalDueDate.setHours(parsed.getHours(), parsed.getMinutes(), 0, 0);
      }
    } else if (finalDueDate && !time) {
      finalDueDate = new Date(finalDueDate);
      finalDueDate.setHours(0, 0, 0, 0);
    }

    onSave({
      title: title.trim() || "Untitled task",
      description,
      priority: priority.toLowerCase() as TaskPriority,
      dueDate: finalDueDate ?? undefined,
      tag: customTag
        ? { id: crypto.randomUUID(), name: customTag.name, color: customTag.color }
        : tagFromCategory(category),
      checklist: checklist.length > 0 ? checklist.map((item) => ({ text: item.title })) : undefined,
      repeat: repeat as Task["repeat"],
      reminder: reminder as Task["reminder"],
    });
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(new Date());
    setPriority("Medium");
    setRepeat("Doesn't repeat");
    setTime(getNextHour());
    setCategory(categoryOptions[Math.floor(Math.random() * categoryOptions.length)]);
    setReminder("None");
    setCustomTag(null);
    setChecklistExpanded(false);
    setChecklist([]);
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
            <h2 className="text-2xl font-semibold">New Task</h2>
            <p className="text-base text-muted-foreground">Add the details of your task</p>
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

        <div
          ref={contentRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-y-contain pr-1 pb-24"
        >
          <DatePickerModal
            open={datePickerOpen}
            value={dueDate}
            onChange={setDueDate}
            onClose={() => setDatePickerOpen(false)}
          />
          <TimePickerModal
            open={timePickerOpen}
            value={time}
            onChange={setTime}
            onClose={() => setTimePickerOpen(false)}
          />
          <SelectModal
            open={priorityPickerOpen}
            title="Priority"
            options={prioritySelectOptions}
            value={priority}
            onChange={setPriority}
            onClose={() => setPriorityPickerOpen(false)}
          />
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
          <SelectModal
            open={tagPickerOpen}
            title="Category"
            options={[...categoryOptions, "Add new tag"]}
            value={category}
            onChange={(value) => {
              if (value === "Add new tag") {
                setTagModalOpen(true);
              } else {
                setCategory(value as CategoryName);
                setCustomTag(null);
              }
            }}
            onClose={() => setTagPickerOpen(false)}
          />
          <TagModal
            open={tagModalOpen}
            onClose={() => setTagModalOpen(false)}
            onSelect={(tag) => {
              setCustomTag(tag);
            }}
          />
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <CheckCircle2 className="size-5" />
            </div>
            <Input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 120))}
              className="pl-10 pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {title.length}/120
            </span>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <AlignLeft className="size-5" />
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 300))}
              placeholder="Add a description (optional)"
              className="min-h-[96px] w-full rounded-md border border-input bg-transparent px-10 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              {description.length}/300
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <OptionRow
                icon={CalendarDays}
                label="Due Date"
                value={formatDateLabel(dueDate)}
                action={dueDate ? "clear" : "dropdown"}
                iconColorClass="text-blue-600"
                onClick={() => setDatePickerOpen(true)}
                onClear={() => setDueDate(null)}
              />
              <OptionRow
                icon={Flag}
                label="Priority"
                value={priority}
                action="dropdown"
                iconColorClass="text-red-600"
                valueColorClass={priorityColor(priority)}
                onClick={() => setPriorityPickerOpen(true)}
              />
              <OptionRow
                icon={Repeat}
                label="Repeat"
                value={repeat}
                action="dropdown"
                iconColorClass="text-green-600"
                onClick={() => setRepeatPickerOpen(true)}
              />
            </div>
            <div className="space-y-3">
              <OptionRow
                icon={Clock}
                label="Time"
                value={time ?? "No time"}
                action={time ? "clear" : "dropdown"}
                iconColorClass="text-blue-600"
                onClick={() => setTimePickerOpen(true)}
                onClear={() => setTime(null)}
              />
              <OptionRow
                icon={Tag}
                label="Category"
                value={customTag?.name ?? category}
                action="dropdown"
                iconColorClass="text-purple-600"
                valueColorClass={categoryTags[category]?.color}
                onClick={() => setTagPickerOpen(true)}
              />
              <OptionRow
                icon={Bell}
                label="Reminder"
                value={reminder}
                action={reminder === "None" ? "dropdown" : "clear"}
                iconColorClass="text-orange-600"
                onClick={() => setReminderPickerOpen(true)}
                onClear={() => setReminder("None")}
              />
            </div>
          </div>

          <div className="rounded-2xl border">
            <button
              type="button"
              onClick={() => setChecklistExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-content-center rounded-xl bg-transparent">
                  <ListChecks className="size-6 text-blue-600" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-base font-semibold">Checklist</span>
                  <span className="text-sm text-muted-foreground">Add subtasks</span>
                </div>
              </div>
              <ChevronRight
                className={`size-5 text-muted-foreground transition-transform ${
                  checklistExpanded ? "rotate-90" : ""
                }`}
              />
            </button>

            {checklistExpanded && (
              <div className="border-t px-4 py-3">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-2">
                    <button
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`flex size-5 shrink-0 items-center justify-center rounded border ${
                        item.completed ? "bg-primary text-primary-foreground" : "bg-background"
                      }`}
                    >
                      {item.completed && <CheckCircle2 className="size-3.5" />}
                    </button>
                    <Input
                      type="text"
                      placeholder="Subtask title"
                      value={item.title}
                      onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                      className="h-8 flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remove subtask"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addChecklistItem}
                  className="mt-2 flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <Plus className="size-4" />
                  Add subtask
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-base font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              Save Task
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

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
}

function TaskDetail({ task, onClose, onUpdate, onDelete }: TaskDetailProps) {
  const [visible, setVisible] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [dueDate, setDueDate] = useState<Date | null>(task.dueDate ?? null);
  const [time, setTime] = useState<string | null>(task.dueDate ? formatTime(task.dueDate) : null);
  const [tag, setTag] = useState<TaskTag | undefined>(task.tag);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task.checklist ?? []);
  const [checklistExpanded, setChecklistExpanded] = useState((task.checklist?.length ?? 0) > 0);
  const [notes, setNotes] = useState(task.description ?? "");
  const [repeat, setRepeat] = useState<string>(task.repeat ?? "Doesn't repeat");
  const [reminder, setReminder] = useState<string>(task.reminder ?? "None");

  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [priorityPickerOpen, setPriorityPickerOpen] = useState(false);
  const [repeatPickerOpen, setRepeatPickerOpen] = useState(false);
  const [reminderPickerOpen, setReminderPickerOpen] = useState(false);
  const [tagPickerOpen, setTagPickerOpen] = useState(false);
  const [tagModalOpen, setTagModalOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const toggleStatus = () => {
    setStatus((prev) => (prev === "done" ? "todo" : "done"));
  };

  const addChecklistItem = () => {
    setChecklist((prev) => [...prev, { id: crypto.randomUUID(), text: "", completed: false }]);
  };

  const updateChecklistItem = (id: string, text: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)));
  };

  const removeChecklistItem = (id: string) => {
    setChecklist((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const handleSave = () => {
    let finalDueDate = dueDate;
    if (finalDueDate && time) {
      const parsed = new Date(`2000-01-01 ${time}`);
      if (!Number.isNaN(parsed.getTime())) {
        finalDueDate = new Date(finalDueDate);
        finalDueDate.setHours(parsed.getHours(), parsed.getMinutes(), 0, 0);
      }
    } else if (finalDueDate && !time) {
      finalDueDate = new Date(finalDueDate);
      finalDueDate.setHours(0, 0, 0, 0);
    }

    onUpdate({
      ...task,
      title,
      description: notes,
      status,
      priority,
      dueDate: finalDueDate ?? undefined,
      tag,
      checklist: checklist.length > 0 ? checklist : undefined,
      repeat: repeat as Task["repeat"],
      reminder: reminder as Task["reminder"],
      completedAt: status === "done" ? (task.completedAt ?? new Date()) : undefined,
      updatedAt: new Date(),
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  const pStyle = taskPriorityStyle(priority);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        className={`absolute inset-y-0 right-0 flex w-full flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-content-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="grid size-10 place-content-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
            aria-label="Delete task"
          >
            <Trash2 className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5">
          <DatePickerModal
            open={datePickerOpen}
            value={dueDate}
            onChange={setDueDate}
            onClose={() => setDatePickerOpen(false)}
          />
          <TimePickerModal
            open={timePickerOpen}
            value={time}
            onChange={(newTime) => {
              setTime(newTime);
              if (dueDate && newTime) {
                const parsed = new Date(`2000-01-01 ${newTime}`);
                if (!Number.isNaN(parsed.getTime())) {
                  const next = new Date(dueDate);
                  next.setHours(parsed.getHours(), parsed.getMinutes(), 0, 0);
                  setDueDate(next);
                }
              }
            }}
            onClose={() => setTimePickerOpen(false)}
          />
          <SelectModal
            open={priorityPickerOpen}
            title="Priority"
            options={prioritySelectOptions}
            value={displayPriority(priority)}
            onChange={(value) => setPriority(value.toLowerCase() as TaskPriority)}
            onClose={() => setPriorityPickerOpen(false)}
          />
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
          <SelectModal
            open={tagPickerOpen}
            title="Category"
            options={[...categoryOptions, "Add new tag"]}
            value={tag?.name ?? "None"}
            onChange={(value) => {
              if (value === "Add new tag") {
                setTagModalOpen(true);
              } else {
                setTag(tagFromCategory(value as CategoryName));
              }
            }}
            onClose={() => setTagPickerOpen(false)}
          />
          <TagModal
            open={tagModalOpen}
            onClose={() => setTagModalOpen(false)}
            onSelect={(selected) =>
              setTag({ id: crypto.randomUUID(), name: selected.name, color: selected.color })
            }
          />

          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={toggleStatus}
              className={`flex size-6 shrink-0 items-center justify-center rounded border ${
                status === "done" ? "bg-primary text-primary-foreground" : "bg-background"
              }`}
              aria-label={status === "done" ? "Mark as not done" : "Mark as done"}
            >
              {status === "done" && <CheckCircle2 className="size-4" />}
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`inline-block h-3 w-3 rounded-full ${pStyle.bg}`} />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 120))}
                  className="min-w-0 flex-1 bg-transparent text-xl font-semibold outline-none placeholder:text-muted-foreground"
                  placeholder="Task title"
                />
              </div>
              {notes ? (
                <p className="text-sm text-muted-foreground">{notes}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border">
            <button
              type="button"
              onClick={() => setChecklistExpanded((prev) => !prev)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-content-center rounded-xl bg-transparent">
                  <ListChecks className="size-6 text-blue-600" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-base font-semibold">Subtasks</span>
                  <span className="text-sm text-muted-foreground">
                    {checklist.length} subtask{checklist.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <ChevronRight
                className={`size-5 text-muted-foreground transition-transform ${
                  checklistExpanded ? "rotate-90" : ""
                }`}
              />
            </button>

            {checklistExpanded && (
              <div className="border-t px-4 py-3">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 py-2">
                    <button
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`flex size-5 shrink-0 items-center justify-center rounded border ${
                        item.completed ? "bg-primary text-primary-foreground" : "bg-background"
                      }`}
                    >
                      {item.completed && <CheckCircle2 className="size-3.5" />}
                    </button>
                    <Input
                      type="text"
                      placeholder="Subtask title"
                      value={item.text}
                      onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                      className="h-8 flex-1 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(item.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label="Remove subtask"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addChecklistItem}
                  className="mt-2 flex items-center gap-2 text-sm font-medium text-primary"
                >
                  <Plus className="size-4" />
                  Add subtask
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <OptionRow
                icon={CalendarDays}
                label="Due Date"
                value={formatDateLabel(dueDate)}
                action={dueDate ? "clear" : "dropdown"}
                iconColorClass="text-blue-600"
                onClick={() => setDatePickerOpen(true)}
                onClear={() => setDueDate(null)}
              />
              <OptionRow
                icon={Flag}
                label="Priority"
                value={displayPriority(priority)}
                action="dropdown"
                iconColorClass="text-red-600"
                valueColorClass={priorityColor(displayPriority(priority))}
                onClick={() => setPriorityPickerOpen(true)}
              />
              <OptionRow
                icon={Repeat}
                label="Repeat"
                value={repeat}
                action="dropdown"
                iconColorClass="text-green-600"
                onClick={() => setRepeatPickerOpen(true)}
              />
            </div>
            <div className="space-y-3">
              <OptionRow
                icon={Clock}
                label="Time"
                value={time ?? "No time"}
                action={time ? "clear" : "dropdown"}
                iconColorClass="text-blue-600"
                onClick={() => setTimePickerOpen(true)}
                onClear={() => setTime(null)}
              />
              <OptionRow
                icon={Tag}
                label="Category"
                value={tag?.name ?? "None"}
                action="dropdown"
                iconColorClass="text-purple-600"
                valueColorClass={tag?.color}
                onClick={() => setTagPickerOpen(true)}
              />
              <OptionRow
                icon={Bell}
                label="Reminder"
                value={reminder}
                action={reminder === "None" ? "dropdown" : "clear"}
                iconColorClass="text-orange-600"
                onClick={() => setReminderPickerOpen(true)}
                onClear={() => setReminder("None")}
              />
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <AlignLeft className="size-5" />
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value.slice(0, 500))}
              placeholder="Notes"
              className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-10 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
            <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
              {notes.length}/500
            </span>
          </div>

          <div className="space-y-3 pt-2 pb-6">
            <button
              type="button"
              onClick={handleSave}
              className="w-full rounded-xl bg-blue-600 py-3.5 text-base font-semibold text-white shadow-md transition-colors hover:bg-blue-700"
            >
              Save Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskGroupSection({ group, defaultExpanded = false, onTaskClick, onTaskToggle, onTaskDelete }: TaskGroupSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const Icon = group.icon;
  const ToggleIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div className="rounded-2xl border">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
          <span className="font-semibold">{group.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${group.badgeClassName ?? "bg-muted text-muted-foreground"}`}>
            {group.tasks.length}
          </span>
          <ToggleIcon className="size-5 text-muted-foreground transition-transform" aria-hidden="true" />
        </div>
      </button>
      {expanded && (
        <ul className="overflow-hidden border-t last:rounded-b-2xl">
          {group.tasks.length === 0 ? (
            <li className="py-4 text-center text-sm text-muted-foreground">No tasks</li>
          ) : (
            group.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                completed={group.key === "completed"}
                onClick={() => onTaskClick?.(task)}
                onToggle={() => onTaskToggle?.(task)}
                onDelete={() => onTaskDelete?.(task)}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export function TasksView() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [confirmDeleteTask, setConfirmDeleteTask] = useState<Task | null>(null);

  useEffect(() => {
    tasksApi.getAll().then(setTasks);
  }, []);

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return tasks.filter(
      (t) =>
        !term ||
        t.title.toLowerCase().includes(term) ||
        t.description?.toLowerCase().includes(term),
    );
  }, [tasks, search]);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const total = filteredTasks.filter(
      (t) => t.status !== "done" && t.status !== "cancelled",
    ).length;
    const completedToday = filteredTasks.filter(
      (t) =>
        t.status === "done" &&
        t.completedAt &&
        isSameDay(t.completedAt, todayStart),
    ).length;
    const pending = filteredTasks.filter(
      (t) => t.status !== "done" && t.status !== "cancelled",
    ).length;
    const overdue = filteredTasks.filter(
      (t) => t.dueDate && t.dueDate < todayStart && t.status !== "done" && t.status !== "cancelled",
    ).length;
    return { total, completedToday, pending, overdue };
  }, [filteredTasks]);

  const groups = useMemo(() => getTaskGroups(filteredTasks, filter), [filteredTasks, filter]);

  const handleUpdateTask = async (updated: Task) => {
    await tasksApi.update(updated.id, {
      title: updated.title,
      description: updated.description,
      status: updated.status,
      priority: updated.priority,
      completedAt: updated.completedAt,
      dueDate: updated.dueDate,
      tag: updated.tag,
      checklist: updated.checklist?.map((item) => ({ text: item.text })),
      repeat: updated.repeat,
      reminder: updated.reminder,
    });
    const refreshed = await tasksApi.getAll();
    setTasks(refreshed);
  };

  const handleDeleteTask = async (id: string) => {
    await tasksApi.delete(id);
    const refreshed = await tasksApi.getAll();
    setTasks(refreshed);
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="px-4 pb-2 pt-4">
        <h1 className="text-2xl font-semibold">My tasks</h1>
        <p className="text-sm text-muted-foreground">Manage everything you need to accomplish</p>
      </header>

      <main className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
        <section className="grid grid-cols-4 gap-3">
          <StatBox
            icon={Inbox}
            label="Total tasks"
            value={String(stats.total)}
            iconColorClass="text-blue-700"
            bgColorClass="bg-blue-100"
          />
          <StatBox
            icon={CheckCircle2}
            label="Completed today"
            value={String(stats.completedToday)}
            iconColorClass="text-green-600"
            bgColorClass="bg-green-100"
          />
          <StatBox
            icon={Circle}
            label="Pending"
            value={String(stats.pending)}
            iconColorClass="text-orange-500"
            bgColorClass="bg-orange-100"
          />
          <StatBox
            icon={TriangleAlert}
            label="Overdue"
            value={String(stats.overdue)}
            iconColorClass="text-red-600"
            bgColorClass="bg-red-100"
          />
        </section>

        <section className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(FILTER_LABELS) as TaskFilter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === key
                    ? "bg-blue-600 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {FILTER_LABELS[key]}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          {groups.map((group, index) => (
            <TaskGroupSection
              key={group.key}
              group={group}
              defaultExpanded={index === 0}
              onTaskClick={(task) => setSelectedTask(task)}
              onTaskToggle={async (task) => {
                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const isCompletedAndPastDue =
                  task.status === "done" && task.dueDate && task.dueDate < todayStart;
                if (isCompletedAndPastDue) return;

                const nextStatus = task.status === "done" ? "todo" : "done";
                await tasksApi.update(task.id, {
                  title: task.title,
                  description: task.description,
                  status: nextStatus,
                  priority: task.priority,
                  completedAt: nextStatus === "done" ? new Date() : undefined,
                  dueDate: task.dueDate,
                  tag: task.tag,
                  checklist: task.checklist?.map((item) => ({ text: item.text })),
                });
                const refreshed = await tasksApi.getAll();
                setTasks(refreshed);
              }}
              onTaskDelete={(task) => {
                if (task.repeat && task.repeat !== "Doesn't repeat") {
                  setConfirmDeleteTask(task);
                } else {
                  handleDeleteTask(task.id);
                }
              }}
            />
          ))}
        </section>
      </main>

      <button
        type="button"
        onClick={() => setIsCreateOpen(true)}
        className="fixed bottom-20 right-4 z-40 grid size-12 place-content-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
        aria-label="Add task"
      >
        <Plus className="size-6" />
      </button>

      <CreateTaskModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSave={async (dto) => {
          await tasksApi.create(dto);
          const refreshed = await tasksApi.getAll();
          setTasks(refreshed);
        }}
      />

      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      )}

      {confirmDeleteTask && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/20" onClick={() => setConfirmDeleteTask(null)} />
          <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-4 shadow-xl">
            <h3 className="mb-2 text-lg font-semibold">Delete repeating task?</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              This task is set to repeat. Deleting it will remove the current occurrence, and it will refresh again based on the repeat schedule.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteTask(null)}
                className="flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmDeleteTask) {
                    handleDeleteTask(confirmDeleteTask.id);
                    setConfirmDeleteTask(null);
                  }
                }}
                className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-semibold text-destructive-foreground transition-colors hover:bg-destructive/90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
