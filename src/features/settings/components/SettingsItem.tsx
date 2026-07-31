"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface SettingsItemProps {
  icon: React.ElementType;
  title: string;
  description?: string;
  disabled?: boolean;
  control?: "switch" | "chevron" | "value";
  checked?: boolean;
  value?: string;
  onToggle?: (checked: boolean) => void;
  onClick?: () => void;
}

export function SettingsItem({
  icon: Icon,
  title,
  description,
  disabled = false,
  control = "chevron",
  checked,
  value,
  onToggle,
  onClick,
}: SettingsItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors",
        disabled ? "cursor-not-allowed opacity-50" : "active:bg-muted/50",
      )}
    >
      <div className="grid size-9 place-content-center rounded-xl bg-muted">
        <Icon className="size-5 text-foreground" aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm font-medium">{title}</span>
        {description && (
          <span className="text-xs text-muted-foreground">{description}</span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {value && <span className="text-sm text-muted-foreground">{value}</span>}
        {control === "switch" && (
          <Switch
            checked={checked}
            onCheckedChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            aria-label={title}
          />
        )}
        {control === "chevron" && (
          <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
        )}
      </div>
    </button>
  );
}
