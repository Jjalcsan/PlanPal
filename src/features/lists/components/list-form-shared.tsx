"use client";

import * as React from "react";
import {
  Baby,
  BookOpen,
  Briefcase,
  Camera,
  Car,
  Check,
  ChevronRight,
  Coffee,
  Dumbbell,
  Gamepad2,
  Gift,
  GraduationCap,
  Heart,
  Home,
  ListChecks,
  ListTodo,
  Music,
  Palette,
  PawPrint,
  Plane,
  Plug,
  ShoppingCart,
  Stethoscope,
  Star,
  Utensils,
  Wallet,
  Wrench,
} from "lucide-react";

export const repeatOptions = [
  "Doesn't repeat",
  "1 day",
  "2 days",
  "1 week",
  "2 weeks",
  "monthly",
  "Semestral",
  "yearly",
];

export const iconOptions = [
  { name: "List", icon: ListTodo },
  { name: "Checklist", icon: ListChecks },
  { name: "Shopping", icon: ShoppingCart },
  { name: "Work", icon: Briefcase },
  { name: "Health", icon: Stethoscope },
  { name: "Travel", icon: Plane },
  { name: "Finance", icon: Wallet },
  { name: "Design", icon: Palette },
  { name: "Home", icon: Home },
  { name: "Reading", icon: BookOpen },
  { name: "Favourite", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Food", icon: Utensils },
  { name: "Coffee", icon: Coffee },
  { name: "Fitness", icon: Dumbbell },
  { name: "Car", icon: Car },
  { name: "Gift", icon: Gift },
  { name: "Music", icon: Music },
  { name: "Photo", icon: Camera },
  { name: "Repair", icon: Wrench },
  { name: "Games", icon: Gamepad2 },
  { name: "Baby", icon: Baby },
  { name: "Pet", icon: PawPrint },
  { name: "Study", icon: GraduationCap },
  { name: "Utilities", icon: Plug },
];

export const colorOptions = [
  { name: "Blue", bg: "bg-blue-500", ring: "ring-blue-500", text: "text-blue-600", soft: "bg-blue-100" },
  { name: "Red", bg: "bg-red-500", ring: "ring-red-500", text: "text-red-600", soft: "bg-red-100" },
  { name: "Green", bg: "bg-green-500", ring: "ring-green-500", text: "text-green-600", soft: "bg-green-100" },
  { name: "Yellow", bg: "bg-yellow-500", ring: "ring-yellow-500", text: "text-yellow-600", soft: "bg-yellow-100" },
  { name: "Purple", bg: "bg-purple-500", ring: "ring-purple-500", text: "text-purple-600", soft: "bg-purple-100" },
  { name: "Orange", bg: "bg-orange-500", ring: "ring-orange-500", text: "text-orange-600", soft: "bg-orange-100" },
  { name: "Pink", bg: "bg-pink-500", ring: "ring-pink-500", text: "text-pink-600", soft: "bg-pink-100" },
  { name: "Slate", bg: "bg-slate-500", ring: "ring-slate-500", text: "text-slate-600", soft: "bg-slate-100" },
];

export interface ChecklistItemDraft {
  id: string;
  title: string;
  completed: boolean;
}

interface SelectModalProps {
  open: boolean;
  title: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export function SelectModal({ open, title, options, value, onChange, onClose }: SelectModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-4 shadow-xl">
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>
        <div className="space-y-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                onClose();
              }}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-base ${
                value === option
                  ? "bg-primary/10 font-medium text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <span>{option}</span>
              {value === option && <Check className="size-5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface IconPickerModalProps {
  open: boolean;
  selected: string;
  onSelect: (name: string) => void;
  onClose: () => void;
}

export function IconPickerModal({ open, selected, onSelect, onClose }: IconPickerModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-4 shadow-xl">
        <h3 className="mb-1 text-lg font-semibold">Choose an icon</h3>
        <p className="mb-3 text-sm text-muted-foreground">Choose an icon for your list</p>
        <div className="grid max-h-80 grid-cols-4 gap-3 overflow-y-auto">
          {iconOptions.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onSelect(name);
                onClose();
              }}
              className={`grid aspect-square place-content-center rounded-xl border transition-colors ${
                selected === name
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:bg-muted"
              }`}
              aria-label={name}
            >
              <Icon className="size-6" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface ColorPickerModalProps {
  open: boolean;
  selected: string;
  onSelect: (name: string) => void;
  onClose: () => void;
}

export function ColorPickerModal({ open, selected, onSelect, onClose }: ColorPickerModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xs rounded-2xl bg-background p-4 shadow-xl">
        <h3 className="mb-3 text-lg font-semibold">Choose a color</h3>
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map(({ name, bg }) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onSelect(name);
                onClose();
              }}
              className={`grid aspect-square place-content-center rounded-full ${bg} ${
                selected === name ? "ring-2 ring-offset-2 ring-primary" : ""
              }`}
              aria-label={name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface OptionRowProps {
  icon?: React.ElementType;
  iconColorClass?: string;
  label: string;
  subtitle?: string;
  onClick?: () => void;
  right?: React.ReactNode;
}

export function OptionRow({ icon: Icon, iconColorClass, label, subtitle, onClick, right }: OptionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="grid size-10 place-content-center rounded-xl bg-transparent">
            <Icon className={`size-6 ${iconColorClass ?? "text-muted-foreground"}`} />
          </div>
        )}
        <div className="flex flex-col text-left">
          <span className="text-sm font-medium">{label}</span>
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {right}
        <ChevronRight className="size-5 text-muted-foreground" />
      </div>
    </button>
  );
}
