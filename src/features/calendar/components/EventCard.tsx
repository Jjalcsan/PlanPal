"use client";

import { ChevronRight } from "lucide-react";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
}

export function getEventColor(category?: string): string {
  switch (category) {
    case "health":
      return "bg-emerald-500";
    case "work":
      return "bg-orange-500";
    case "birthday":
      return "bg-purple-500";
    case "personal":
    default:
      return "bg-blue-500";
  }
}

export function getEventPastelColor(category?: string): string {
  switch (category) {
    case "health":
      return "bg-emerald-100";
    case "work":
      return "bg-orange-100";
    case "birthday":
      return "bg-purple-100";
    case "personal":
    default:
      return "bg-blue-100";
  }
}

/** Solid indicator-dot color for an event: prefers its tag's dot color, falling back to the category color. */
export function getEventDotColor(event: CalendarEvent): string {
  return event.tag?.dotColor ?? getEventColor(event.category);
}

function formatEventTime(date: Date, allDay: boolean): string {
  if (allDay) return "All day";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(event)}
      className="flex w-full items-center gap-3 rounded-2xl border bg-card p-4 text-left shadow-sm transition-colors active:bg-muted/50"
    >
      <div
        className={cn(
          "grid size-10 shrink-0 place-content-center rounded-xl",
          getEventPastelColor(event.category),
        )}
      >
        <div className={cn("size-2.5 rounded-full", getEventColor(event.category))} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-xs font-medium text-muted-foreground">
          {formatEventTime(event.startDate, event.allDay)}
        </span>
        <span className="truncate text-sm font-semibold">{event.title}</span>
        {event.description && (
          <span className="truncate text-xs text-muted-foreground">{event.description}</span>
        )}
        {event.location && !event.description && (
          <span className="truncate text-xs text-muted-foreground">{event.location}</span>
        )}
      </div>
      {event.tag && (
        <span className={cn("shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium", event.tag.color)}>
          {event.tag.name}
        </span>
      )}
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
    </button>
  );
}
