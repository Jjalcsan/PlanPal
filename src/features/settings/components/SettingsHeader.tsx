"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsHeader() {
  return (
    <header className="flex items-start justify-between gap-4 px-4 pt-6 pb-4">
      <div className="min-w-0 space-y-1">
        <h1 className="text-[32px] font-semibold leading-none tracking-tight">
          Settings
        </h1>
        <p className="text-base text-muted-foreground">
          Customize your PlanPal experience.
        </p>
      </div>
      <Button variant="ghost" size="icon" aria-label="Search">
        <Search className="size-5" aria-hidden="true" />
      </Button>
    </header>
  );
}
