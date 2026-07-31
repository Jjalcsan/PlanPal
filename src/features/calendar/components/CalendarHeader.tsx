"use client";

import { Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  title: string;
}

export function CalendarHeader({ title }: CalendarHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4 px-4 pt-6 pb-4">
      <div className="min-w-0 space-y-1">
        <h1 className="text-[32px] font-semibold leading-none tracking-tight">
          Calendar
        </h1>
        <p className="text-lg font-medium text-muted-foreground">{title}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="size-5" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="More options">
          <MoreHorizontal className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
