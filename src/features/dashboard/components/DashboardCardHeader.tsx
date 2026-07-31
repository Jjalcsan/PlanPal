import { type LucideIcon } from "lucide-react";
import {
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardCardHeaderProps {
  icon: LucideIcon;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function DashboardCardHeader({
  icon: Icon,
  title,
  actionLabel = "View all",
  onAction,
}: DashboardCardHeaderProps) {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="size-5 text-primary" aria-hidden="true" />
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onAction}
        aria-label={`${actionLabel} ${title.toLowerCase()}`}
      >
        {actionLabel}
      </Button>
    </CardHeader>
  );
}
