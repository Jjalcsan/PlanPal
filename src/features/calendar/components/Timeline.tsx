"use client";

import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";
import { EventCard } from "./EventCard";

interface TimelineProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
}

export function Timeline({ events, onEventClick }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card px-6 py-14 text-center shadow-sm">
        <div className="grid size-16 place-content-center rounded-full bg-muted">
          <span className="text-2xl">🗓️</span>
        </div>
        <div className="space-y-1">
          <p className="text-base font-semibold">No events scheduled</p>
          <p className="text-sm text-muted-foreground">
            Enjoy your free day or create a new reminder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} onClick={onEventClick} />
      ))}
    </div>
  );
}
