"use client";

import { Card, CardContent } from "@/components/ui/card";

interface ProgressCardProps {
  progress: number;
}

export function ProgressCard({ progress }: ProgressCardProps) {
  return (
    <Card className="ring-0 border-t border-b border-l border-r border-t-foreground/4 border-b-foreground/70 border-l-foreground/18 border-r-foreground/18">
      <CardContent className="space-y-6 p-4">
        <h3 className="text-lg font-semibold">Weekly progress</h3>

        <div className="flex items-center gap-6">
          <div
            className="relative grid size-28 shrink-0 place-content-center"
            aria-label={`Weekly progress: ${progress}%`}
            role="img"
          >
            <svg className="size-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
              <path
                className="text-muted/60"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-blue-600"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 grid place-content-center text-xl font-semibold">
              {progress}%
            </span>
          </div>
          <p className="min-w-0 text-base text-muted-foreground">
            You are on track this week. Keep the momentum going.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Weekly consistency</h4>
          <div className="flex h-24 items-end justify-between gap-1 rounded-xl border border-dashed bg-muted/20 px-4 py-3">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div
                key={day}
                className="flex flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="w-full rounded-md bg-muted-foreground/10" style={{ height: "4px" }} />
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  {day}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            "Small progress every day leads to big results."
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
