"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";
import { getEventDotColor } from "./EventCard";

interface MonthlyCalendarProps {
  year: number;
  month: number;
  selected: Date;
  events: CalendarEvent[];
  onSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter((event) => isSameDay(event.startDate, date));
}

export function MonthlyCalendar({
  year,
  month,
  selected,
  events,
  onSelect,
  onPrevMonth,
  onNextMonth,
}: MonthlyCalendarProps) {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDayOfMonth.getDay();
  const monthLabel = firstDayOfMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const cells: (Date | null)[] = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, month, day));
  }

  return (
    <div className="mx-4 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="grid size-8 place-content-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          aria-label="Previous month"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="text-sm font-semibold">{monthLabel}</span>
        <button
          type="button"
          onClick={onNextMonth}
          className="grid size-8 place-content-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
          aria-label="Next month"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
      <div className="mb-3 grid grid-cols-7 text-center">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-xs font-medium text-muted-foreground">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-3 text-center">
        {cells.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} />;
          }

          const active = isSameDay(date, selected);
          const dayEvents = getEventsForDate(events, date);

          return (
            <button
              key={date.toISOString()}
              type="button"
              onClick={() => onSelect(date)}
              className={cn(
                "mx-auto flex size-10 flex-col items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
              aria-pressed={active}
            >
              <span className="text-sm font-semibold">{date.getDate()}</span>
              <div className="mt-0.5 flex h-1 items-center justify-center gap-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <span
                    key={event.id}
                    className={cn("size-1 rounded-full", getEventDotColor(event))}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
