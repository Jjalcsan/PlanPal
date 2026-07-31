"use client";

import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName?: string;
}

function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const now = new Date();
  const greeting = `${getGreeting(now)}${userName ? `, ${userName}` : ""}`;

  return (
    <header className="flex items-start justify-between gap-4 px-4 pt-6 pb-4">
      <div className="min-w-0 space-y-1">
        <h1 className="text-[34px] font-semibold leading-none tracking-tight">
          {greeting}
        </h1>
        <p className="text-lg text-muted-foreground">
          Here&apos;s your overview for today.
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="size-5" aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
}
