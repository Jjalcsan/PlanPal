"use client";

import { ChevronRight, User } from "lucide-react";

interface ProfileCardProps {
  name: string;
  subtitle: string;
}

export function ProfileCard({ name, subtitle }: ProfileCardProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left shadow-sm transition-colors active:bg-muted/50"
    >
      <div className="grid size-14 place-content-center rounded-full bg-blue-100">
        <User className="size-7 text-blue-600" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-lg font-semibold">{name}</span>
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      </div>
      <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
    </button>
  );
}
