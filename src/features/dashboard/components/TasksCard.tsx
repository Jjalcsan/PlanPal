"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { formatTime } from "@/features/dashboard/lib/format";
import type { Task } from "@/features/tasks/types/Task";

interface TasksCardProps {
  title?: string;
  totalPending: number;
  pendingTasks: Task[];
}

function priorityColor(priority: Task["priority"]): string {
  switch (priority) {
    case "critical":
      return "bg-red-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-yellow-500";
    default:
      return "bg-muted-foreground/40";
  }
}

function CircularCheckbox({
  id,
  label,
}: {
  id: string;
  label: string;
}) {
  return (
    <div className="relative flex size-5 shrink-0 items-center justify-center rounded-full border border-input">
      <input
        id={id}
        type="checkbox"
        aria-label={`Mark ${label} as complete`}
        className="peer absolute inset-0 cursor-pointer opacity-0"
      />
      <span className="size-3 rounded-full bg-transparent transition-colors peer-checked:bg-primary" />
    </div>
  );
}

export function TasksCard({
  title = "Today's tasks",
  totalPending,
  pendingTasks,
}: TasksCardProps) {
  const displayedTasks = pendingTasks.slice(0, 4);
  const remainingTasks = Math.max(0, totalPending - displayedTasks.length);

  return (
    <Card className="flex flex-col ring-0 border-t border-b border-l border-r border-t-foreground/4 border-b-foreground/70 border-l-foreground/18 border-r-foreground/18">
      <CardContent className="flex flex-1 flex-col space-y-4 px-3 py-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2
              className="size-6 text-primary"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <a
            href="/tasks"
            className="flex items-center gap-0.5 text-sm font-medium text-blue-600 hover:underline"
          >
            View all
            <ChevronRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        {displayedTasks.length > 0 && (
          <ul className="flex-1 divide-y">
            {displayedTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <CircularCheckbox id={`task-${task.id}`} label={task.title} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor={`task-${task.id}`}
                      className="truncate text-base font-medium"
                    >
                      {task.title}
                    </label>
                    {task.tag && (
                      <span
                        className={`shrink-0 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${task.tag.color}`}
                      >
                        {task.tag.name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2.5">
                  {task.dueDate && (
                    <time
                      dateTime={task.dueDate.toISOString()}
                      className="text-sm text-muted-foreground"
                    >
                      {formatTime(task.dueDate)}
                    </time>
                  )}
                  <span
                    className={`size-2.5 rounded-full ${priorityColor(task.priority)}`}
                    aria-label={`Priority: ${task.priority}`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        {remainingTasks > 0 ? (
          <a
            href="/tasks"
            className="block text-center text-sm font-medium text-blue-600 hover:underline"
          >
            +{remainingTasks} more tasks
          </a>
        ) : (
          <p className="text-center text-sm font-medium text-muted-foreground">
            No more tasks today!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
