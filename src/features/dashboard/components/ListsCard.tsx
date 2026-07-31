"use client";

import { ChevronRight, ListTodo, MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { colorOptions, iconOptions } from "@/features/lists/components/list-form-shared";
import type { List } from "@/features/lists/types/List";

function getListTheme(list: List) {
  const iconOption = iconOptions.find((i) => i.name === list.icon);
  const colorOption = colorOptions.find((c) => c.name === list.color) ?? colorOptions[0];
  return {
    icon: iconOption?.icon ?? ListTodo,
    color: colorOption.bg,
    bg: colorOption.soft,
  };
}


interface ListsCardProps {
  title?: string;
  lists: List[];
}

export function ListsCard({ title = "Lists", lists }: ListsCardProps) {
  const displayedLists = lists.slice(0, 3);
  const remaining = lists.length - displayedLists.length;

  return (
    <Card className="flex flex-col ring-0 border-t border-b border-l border-r border-t-foreground/4 border-b-foreground/70 border-l-foreground/18 border-r-foreground/18">
      <CardContent className="flex flex-1 flex-col space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ListTodo className="size-6 text-primary" aria-hidden="true" />
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <a
            href="/lists"
            className="flex items-center gap-0.5 text-sm font-medium text-blue-600 hover:underline"
          >
            View all
            <ChevronRight className="size-4" aria-hidden="true" />
          </a>
        </div>

        {displayedLists.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No active lists.
          </p>
        ) : (
          <div className="flex gap-2">
            {displayedLists.map((list) => {
              const theme = getListTheme(list);
              const total = list.items.length;
              const isChecklist = list.mode === "checklist";
              const completed = isChecklist
                ? list.items.filter((item) => item.completed).length
                : 0;
              const progress = isChecklist && total > 0 ? (completed / total) * 100 : 100;
              const Icon = theme.icon;

              return (
                <div
                  key={list.id}
                  className="relative flex min-w-0 flex-1 flex-col items-center gap-2 overflow-hidden rounded-xl border p-3 text-center"
                >
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 z-0"
                    style={{ width: `${progress}%` }}
                  >
                    <div className={`h-full ${theme.bg}`} />
                  </div>

                  <div
                    className={`relative z-10 flex size-10 items-center justify-center rounded-xl ${theme.color}`}
                  >
                    <Icon className="size-5 text-white" />
                  </div>
                  <div className="relative z-10 min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {list.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isChecklist ? `${completed}/${total} items` : `${total} items`}
                    </p>
                  </div>
                </div>
              );
            })}

            {remaining > 0 && (
              <a
                href="/lists"
                className="flex min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl border p-3 text-muted-foreground transition-colors hover:bg-muted/50"
              >
                <MoreHorizontal className="size-5" />
                <span className="text-xs font-medium">+{remaining} other</span>
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
