"use client";

import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";
import { getEventColor } from "./EventCard";

interface HourInfo {
  date: Date;
  hour: number;
  label: string;
}

interface DaySelectorProps {
  hours: HourInfo[];
  selected: Date;
  events: CalendarEvent[];
  onSelect: (date: Date) => void;
}

function isSameHour(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate() &&
    a.getHours() === b.getHours()
  );
}

function getEventsForHour(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(
    (event) =>
      !event.allDay &&
      event.startDate.getFullYear() === date.getFullYear() &&
      event.startDate.getMonth() === date.getMonth() &&
      event.startDate.getDate() === date.getDate() &&
      event.startDate.getHours() === date.getHours(),
  );
}

export function DaySelector({ hours, selected, events, onSelect }: DaySelectorProps) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2">
      {hours.map(({ date, hour, label }) => {
        const active = isSameHour(date, selected);
        const hourEvents = getEventsForHour(events, date);
        return (
          <button
            key={hour}
            type="button"
            onClick={() => onSelect(date)}
            className={cn(
              "flex min-w-[3.25rem] flex-col items-center gap-1 rounded-2xl border px-3 py-2.5 transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-transparent bg-card text-foreground shadow-sm",
            )}
            aria-pressed={active}
          >
            <span className="text-sm font-semibold">{label}</span>
            <div className="flex h-1 items-center justify-center gap-0.5">
              {hourEvents.slice(0, 3).map((event) => (
                <span
                  key={event.id}
                  className={cn("size-1 rounded-full", getEventColor(event.category))}
                />
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
}
