"use client";

import { Minus, Plus, X, type LucideIcon } from "lucide-react";

interface TitleBarProps {
  title: string;
  dark: boolean;
  active: boolean;
  maximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
}

// The drag handle for its window (react-rnd finds it by class name).
export function TitleBar({ title, dark, active, maximized, onClose, onMinimize, onToggleMaximize }: TitleBarProps) {
  return (
    <div
      className={`window-drag-handle flex h-10 shrink-0 items-center gap-2 px-2 ${
        dark
          ? "bg-terminal-titlebar text-[#A9B1BD]"
          : "bg-window-titlebar border-window-border border-b text-[#3A3D44]"
      }`}
      onDoubleClick={onToggleMaximize}
    >
      <div className="window-no-drag group flex items-center">
        <Light
          label="Close"
          color={active ? "bg-light-close" : "bg-[#9AA0A8]/50 group-hover:bg-light-close"}
          glyph={X}
          onClick={onClose}
        />
        <Light
          label="Minimize"
          color={active ? "bg-light-minimize" : "bg-[#9AA0A8]/50 group-hover:bg-light-minimize"}
          glyph={Minus}
          onClick={onMinimize}
        />
        <Light
          label={maximized ? "Restore" : "Maximize"}
          color={active ? "bg-light-maximize" : "bg-[#9AA0A8]/50 group-hover:bg-light-maximize"}
          glyph={Plus}
          onClick={onToggleMaximize}
        />
      </div>
      <span className={`ml-2.5 truncate text-[13px] ${dark ? "" : "font-semibold"} ${active ? "" : "opacity-60"}`}>
        {title}
      </span>
    </div>
  );
}

// Like macOS: grey in background windows (see `color`), glyphs appear on hover.
// The dot is 12px; the button around it is 24px, the minimum tap target size.
function Light({
  label,
  color,
  glyph: Glyph,
  onClick,
}: {
  label: string;
  color: string;
  glyph: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      onDoubleClick={(e) => e.stopPropagation()}
      className="flex size-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-accent"
    >
      <span className={`flex size-3 items-center justify-center rounded-full ${color}`}>
        <Glyph size={8} strokeWidth={3} className="text-black/55 opacity-0 group-hover:opacity-100" aria-hidden />
      </span>
    </button>
  );
}
