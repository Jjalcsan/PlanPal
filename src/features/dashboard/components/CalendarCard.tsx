"use client";

import { Calendar, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  formatTime,
  formatWeekday,
} from "@/features/dashboard/lib/format";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";

interface CalendarCardProps {
  title?: string;
  events: CalendarEvent[];
}

interface WeekStripProps {
  events: CalendarEvent[];
}

function WeekStrip({ events }: WeekStripProps) {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);

  const days = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return date;
  });

  return (
    <div className="flex justify-between rounded-xl border p-2">
      {days.map((date) => {
        const isToday = date.toDateString() === today.toDateString();
        const dayEvents = events.filter(
          (event) => event.startDate.toDateString() === date.toDateString(),
        );

        return (
          <div
            key={date.toISOString()}
            className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-2 ${
              isToday ? "bg-muted/80" : ""
            }`}
          >
            <span className="text-[10px] font-medium uppercase text-muted-foreground">
              {formatWeekday(date)}
            </span>
            <span
              className={`text-sm font-semibold ${
                isToday ? "text-primary" : ""
              }`}
            >
              {date.getDate()}
            </span>
            <div className="flex gap-0.5">
              {dayEvents.slice(0, 3).map((event) => (
                <span
                  key={event.id}
                  className={`size-1.5 rounded-full ${event.tag?.dotColor ?? "bg-muted-foreground/40"}`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatEventTime(event: CalendarEvent, today: Date): string {
  const isSameDay = event.startDate.toDateString() === today.toDateString();
  const time = event.allDay ? "All day" : formatTime(event.startDate);

  if (isSameDay) return time;
  return `${formatWeekday(event.startDate)}, ${time}`;
}

export function CalendarCard({ title = "Calendar", events }: CalendarCardProps) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEvents = events
    .filter((event) => event.startDate >= todayStart)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 4);

  return (
    <Card className="flex flex-col ring-0 border-t border-b border-l border-r border-t-foreground/4 border-b-foreground/70 border-l-foreground/18 border-r-foreground/18">
      <CardContent className="flex flex-1 flex-col space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="size-6 text-primary" aria-hidden="true" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <a
            href="/calendar"
            className="flex items-center gap-0.5 text-sm font-medium text-blue-600 hover:underline"
          >
            View Calendar
            <ChevronRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        <WeekStrip events={events} />

        {todayEvents.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No events today.
          </p>
        ) : (
          <ul className="flex-1">
            {todayEvents.map((event, index) => {
              const isLast = index === todayEvents.length - 1;
              return (
                <li
                  key={event.id}
                  className="flex gap-3"
                >
                  <div className="relative flex flex-col items-center">
                    <span
                      className={`mt-1.5 size-2.5 shrink-0 rounded-full ${event.tag?.dotColor ?? "bg-muted-foreground/40"}`}
                      aria-label={`Tag: ${event.tag?.name ?? "none"}`}
                    />
                    {!isLast && (
                      <div className="absolute left-1/2 top-[calc(0.625rem+0.75rem)] h-[calc(100%+0.75rem)] w-px -translate-x-1/2 bg-muted-foreground/20" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pb-3 last:pb-0">
                    <p className="truncate text-base font-medium">{event.title}</p>
                    <time
                      dateTime={event.startDate.toISOString()}
                      className="text-sm text-muted-foreground"
                    >
                      {formatEventTime(event, now)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
