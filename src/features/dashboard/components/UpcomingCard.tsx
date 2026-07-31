"use client";

import { CalendarDays } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { DashboardCardHeader } from "@/features/dashboard/components/DashboardCardHeader";
import {
  formatDayAndMonth,
  formatTime,
  formatWeekday,
} from "@/features/dashboard/lib/format";
import type { CalendarEvent } from "@/features/calendar/types/CalendarEvent";

interface UpcomingCardProps {
  title?: string;
  events: CalendarEvent[];
}

export function UpcomingCard({ title = "Upcoming", events }: UpcomingCardProps) {
  return (
    <Card className="w-full">
      <DashboardCardHeader icon={CalendarDays} title={title} />
      <CardContent>
        {events.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No upcoming events.
          </p>
        ) : (
          <ul className="divide-y">
            {events.map((event) => (
              <li
                key={event.id}
                className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
              >
                <time
                  dateTime={event.startDate.toISOString().split("T")[0]}
                  className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border text-center"
                >
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">
                    {formatWeekday(event.startDate)}
                  </span>
                  <span className="text-sm font-semibold">
                    {event.startDate.getDate()}
                  </span>
                </time>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-medium">{event.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {event.allDay
                      ? formatDayAndMonth(event.startDate)
                      : formatTime(event.startDate)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
