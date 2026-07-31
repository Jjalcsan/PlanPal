"use client";

import * as React from "react";
import { Separator } from "@/components/ui/separator";

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const items = React.Children.toArray(children);

  return (
    <section className="space-y-2">
      <h2 className="px-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
      <div className="rounded-2xl border bg-card shadow-sm">
        {items.map((item, index) => (
          <div key={index}>
            {item}
            {index < items.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </section>
  );
}
