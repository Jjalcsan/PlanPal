"use client";

import {
  CheckCircle2,
  Calendar,
  ListTodo,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

interface DailySummaryItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  iconColorClass: string;
  bgColorClass: string;
}

function DailySummaryItem({
  icon: Icon,
  label,
  value,
  iconColorClass,
  bgColorClass,
}: DailySummaryItemProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-muted/50 py-5">
      <div className="flex items-center gap-2.5">
        <div className={`grid size-10 place-content-center rounded-full ${bgColorClass}`}>
          <Icon className={`size-5 ${iconColorClass}`} aria-hidden="true" />
        </div>
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
      </div>
      <span className="text-center text-sm font-medium text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

interface DailySummaryRowProps {
  tasksToday: number;
  eventsToday: number;
  activeLists: number;
  weeklyProgress: number;
}

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function DailySummaryRow({
  tasksToday,
  eventsToday,
  activeLists,
  weeklyProgress,
}: DailySummaryRowProps) {
  return (
    <section
      aria-label="Daily summary"
      className="grid grid-cols-4 gap-3"
    >
      <DailySummaryItem
        icon={CheckCircle2}
        label={pluralize(tasksToday, "Task today", "Tasks today")}
        value={String(tasksToday)}
        iconColorClass="text-blue-700"
        bgColorClass="bg-blue-100"
      />
      <DailySummaryItem
        icon={Calendar}
        label={pluralize(eventsToday, "Event today", "Events today")}
        value={String(eventsToday)}
        iconColorClass="text-green-600"
        bgColorClass="bg-green-100"
      />
      <DailySummaryItem
        icon={ListTodo}
        label="Active lists"
        value={String(activeLists)}
        iconColorClass="text-orange-500"
        bgColorClass="bg-orange-100"
      />
      <DailySummaryItem
        icon={TrendingUp}
        label="Weekly progress"
        value={`${weeklyProgress}%`}
        iconColorClass="text-purple-600"
        bgColorClass="bg-purple-100"
      />
    </section>
  );
}
