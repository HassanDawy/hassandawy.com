"use client";

import { useRef, type KeyboardEvent } from "react";
import { firstLine, formatShortDate } from "@/lib/format";
import type { FileNode } from "@/lib/fs/types";

interface Props {
  /** Already in display order: pinned first, then newest first. */
  notes: FileNode[];
  selectedPath: string | undefined;
  onSelect: (path: string) => void;
}

// The left column from the mockup: "Pinned", then one group per year. Each row
// shows the title and "Oct 27 · first line". Up/Down move between notes.
export function NoteList({ notes, selectedPath, onSelect }: Props) {
  const listRef = useRef<HTMLElement>(null);
  const groups: { label: string; notes: FileNode[] }[] = [];
  for (const note of notes) {
    const label = note.meta.pinned ? "Pinned" : String(note.meta.date ?? "").slice(0, 4);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.notes.push(note);
    else groups.push({ label, notes: [note] });
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const i = notes.findIndex((n) => n.path === selectedPath);
    const next = notes[Math.min(notes.length - 1, Math.max(0, i + (e.key === "ArrowDown" ? 1 : -1)))];
    if (!next) return;
    onSelect(next.path);
    listRef.current?.querySelector<HTMLElement>(`[data-path="${CSS.escape(next.path)}"]`)?.focus();
  }

  return (
    <nav
      ref={listRef}
      aria-label="Notes"
      onKeyDown={onKeyDown}
      className="w-[250px] shrink-0 overflow-y-auto border-r border-[#E2DFD8]"
    >
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3.5 pt-3 pb-1.5 text-[11px] font-semibold text-[#6B6F78]">{group.label}</p>
          {group.notes.map((note) => {
            const selected = note.path === selectedPath;
            return (
              <button
                key={note.path}
                type="button"
                data-path={note.path}
                aria-current={selected ? "true" : undefined}
                onClick={() => onSelect(note.path)}
                className={`flex w-full flex-col gap-1 px-3.5 py-3 text-left ${
                  selected ? "bg-[#F3D46B]" : "border-b border-[#ECE9E3] hover:bg-black/[0.03]"
                }`}
              >
                <span className={`truncate text-[13px] ${selected ? "font-bold" : "font-semibold"}`}>
                  {String(note.meta.title ?? note.name)}
                </span>
                <span className={`truncate text-xs ${selected ? "text-[#3A3D44]" : "text-[#5A5E67]"}`}>
                  {formatShortDate(note.meta.date)} · {firstLine(note.body ?? "")}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
