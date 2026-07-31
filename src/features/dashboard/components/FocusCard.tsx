"use client";

import { Target } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { DashboardCardHeader } from "@/features/dashboard/components/DashboardCardHeader";
import { formatDuration } from "@/features/dashboard/lib/format";

interface FocusCardProps {
  title?: string;
  focusText: string;
  timeInvestedTodayMinutes: number;
  weeklyConsistency: number[];
}

function WeeklyBarChart({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  const dayLabels = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div
      className="flex h-24 items-end justify-between gap-1.5"
      role="img"
      aria-label="Weekly consistency chart"
    >
      {values.map((value, index) => {
        const height = `${Math.round((value / max) * 100)}%`;

        return (
          <div
            key={index}
            className="flex flex-1 flex-col items-center gap-1"
          >
            <div
              className="w-full rounded-t bg-primary/80 transition-all"
              style={{ height }}
              aria-hidden="true"
            />
            <span className="text-[10px] font-medium text-muted-foreground">
              {dayLabels[index]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function FocusCard({
  title = "Focus",
  focusText,
  timeInvestedTodayMinutes,
  weeklyConsistency,
}: FocusCardProps) {
  return (
    <Card className="flex flex-col">
      <DashboardCardHeader icon={Target} title={title} />
      <CardContent className="flex-1 space-y-5">
        <section className="space-y-1">
          <h3 className="text-sm text-muted-foreground">Today&apos;s focus</h3>
          <p className="text-lg font-medium leading-snug">{focusText}</p>
        </section>

        <section className="space-y-1">
          <h3 className="text-sm text-muted-foreground">Time invested today</h3>
          <p className="text-2xl font-semibold">
            {formatDuration(timeInvestedTodayMinutes)}
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="text-sm text-muted-foreground">Weekly consistency</h3>
          <WeeklyBarChart values={weeklyConsistency} />
        </section>

        <p className="text-sm italic text-muted-foreground">
          &ldquo;Small progress every day leads to big results.&rdquo;
        </p>
      </CardContent>
    </Card>
  );
}
