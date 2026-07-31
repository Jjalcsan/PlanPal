"use client";

export type CalendarViewMode = "weekly" | "monthly";

const VIEWS: { key: CalendarViewMode; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

interface ViewSelectorProps {
  value: CalendarViewMode;
  onChange: (view: CalendarViewMode) => void;
}

export function ViewSelector({ value, onChange }: ViewSelectorProps) {
  return (
    <div className="mx-4 flex rounded-full bg-muted p-1">
      {VIEWS.map((view) => {
        const active = value === view.key;
        return (
          <button
            key={view.key}
            type="button"
            onClick={() => onChange(view.key)}
            className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={active}
          >
            {view.label}
          </button>
        );
      })}
    </div>
  );
}
