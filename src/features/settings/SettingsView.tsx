"use client";

import { useState } from "react";
import {
  Palette,
  Droplet,
  Bell,
  Volume2,
  Newspaper,
  CalendarDays,
  Calendar,
  Database,
  Download,
  Upload,
  RotateCcw,
  Shield,
  FileText,
  Info,
  Code,
} from "lucide-react";
import {
  SettingsHeader,
  ProfileCard,
  SettingsSection,
  SettingsItem,
} from "@/features/settings/components";

export default function SettingsView() {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(false);
  const [dailySummary, setDailySummary] = useState(true);

  return (
    <div className="flex flex-1 flex-col">
      <SettingsHeader />

      <main className="flex-1 space-y-8 overflow-y-auto px-4 pb-28">
        <ProfileCard name="Juan" subtitle="Personal Workspace" />

        <SettingsSection title="Appearance">
          <SettingsItem
            icon={Palette}
            title="Theme"
            description="Light, Dark or System"
          />
          <SettingsItem
            icon={Droplet}
            title="Accent Color"
            description="Blue (future customization)"
          />
        </SettingsSection>

        <SettingsSection title="Notifications">
          <SettingsItem
            icon={Bell}
            title="Enable Notifications"
            control="switch"
            checked={notifications}
            onToggle={setNotifications}
          />
          <SettingsItem
            icon={Volume2}
            title="Reminder Sounds"
            control="switch"
            checked={sounds}
            onToggle={setSounds}
          />
          <SettingsItem
            icon={Newspaper}
            title="Daily Summary"
            control="switch"
            checked={dailySummary}
            onToggle={setDailySummary}
          />
        </SettingsSection>

        <SettingsSection title="Calendar">
          <SettingsItem
            icon={CalendarDays}
            title="Default Calendar View"
            description="Daily"
          />
          <SettingsItem
            icon={Calendar}
            title="First Day of Week"
            description="Monday"
          />
          <SettingsItem
            icon={Database}
            title="System Calendar Integration"
            description="Coming in a future version"
            disabled
          />
        </SettingsSection>

        <SettingsSection title="Data & Storage">
          <SettingsItem icon={Download} title="Export Data" />
          <SettingsItem icon={Upload} title="Import Data" />
          <SettingsItem icon={RotateCcw} title="Reset Application" />
        </SettingsSection>

        <SettingsSection title="Privacy">
          <SettingsItem icon={Shield} title="Privacy Policy" />
          <SettingsItem icon={FileText} title="Licenses" />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsItem
            icon={Info}
            title="PlanPal"
            value="Version 1.0.0"
          />
          <SettingsItem icon={Code} title="GitHub Repository" />
        </SettingsSection>
      </main>
    </div>
  );
}
