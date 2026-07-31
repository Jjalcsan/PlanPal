"use client";

import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";
import { getEventDotColor } from "./EventCard";

interface WeekDay {
  date: Date;
  label: string;
  day: number;
}

interface WeeklyStripProps {
  days: WeekDay[];
  selected: Date;
  events: CalendarEvent[];
  onSelect: (date: Date) => void;
}

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

export function WeeklyStrip({ days, selected, events, onSelect }: WeeklyStripProps) {
  return (
    <div className="grid grid-cols-7 gap-2 px-4">
      {days.map(({ date, label, day }) => {
        const active = isSameDay(date, selected);
        const dayEvents = getEventsForDate(events, date);
        return (
          <button
            key={date.toISOString()}
            type="button"
            onClick={() => onSelect(date)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl border py-3 transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-transparent bg-card text-foreground shadow-sm",
            )}
            aria-pressed={active}
          >
            <span className="text-xs font-medium opacity-90">{label}</span>
            <span className="text-base font-semibold">{day}</span>
            <div className="flex h-1 items-center justify-center gap-0.5">
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
  );
}
