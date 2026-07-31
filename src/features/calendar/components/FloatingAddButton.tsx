"use client";

import { Plus } from "lucide-react";

interface FloatingAddButtonProps {
  onClick?: () => void;
}

export function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-20 right-4 z-40 grid size-12 place-content-center rounded-full bg-blue-600 text-white shadow-lg transition-transform active:scale-95"
      aria-label="Add event"
    >
      <Plus className="size-6" />
    </button>
  );
}
