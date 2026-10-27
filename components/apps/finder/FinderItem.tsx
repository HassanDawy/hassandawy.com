"use client";

import { ArrowUpRight } from "lucide-react";
import type { FsNode } from "@/lib/fs/types";

interface FinderItemProps {
  node: FsNode;
  label: string;
  isDir: boolean;
  dimmed: boolean;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

// One icon in the grid: click selects, double-click or Enter opens.
export function FinderItem({ node, label, isDir, dimmed, selected, onSelect, onOpen }: FinderItemProps) {
  const title = typeof node.meta.title === "string" ? node.meta.title : undefined;
  return (
    <button
      type="button"
      title={title && title !== label ? title : undefined}
      aria-pressed={selected}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen();
      }}
      className="flex flex-col items-center gap-1.5 rounded-md p-1.5 text-center outline-none focus-visible:bg-black/5"
    >
      <span className={`relative rounded-md p-1 ${selected ? "bg-black/10" : ""}`}>
        {isDir ? <FolderIcon color={dimmed ? "#8E9AAF" : "#5B8DEF"} /> : <FileIcon name={node.name} />}
        {node.type === "link" && (
          <span className="absolute bottom-0.5 left-0.5 flex size-4 items-center justify-center rounded-full bg-white text-[#1A1D23] shadow">
            <ArrowUpRight size={11} strokeWidth={2.5} aria-label="alias" />
          </span>
        )}
      </span>
      <span
        className={`line-clamp-2 rounded px-1.5 text-xs leading-snug break-words ${
          selected ? "bg-folder text-white" : "text-[#1A1D23]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

// The folder shape from the mockup.
function FolderIcon({ color }: { color: string }) {
  return (
    <svg width="56" height="46" viewBox="0 0 56 46" aria-hidden>
      <path d="M2 8a4 4 0 0 1 4-4h14l5 5h25a4 4 0 0 1 4 4v27a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z" fill={color} />
    </svg>
  );
}

function FileIcon({ name }: { name: string }) {
  const ext = name.includes(".") ? name.split(".").pop()!.toUpperCase() : "";
  return (
    <span className="flex h-[46px] w-[56px] items-center justify-center" aria-hidden>
      <span className="flex h-[46px] w-9 items-end justify-center rounded-[3px] border border-[#D8D5CE] bg-white pb-1.5 text-[8px] font-bold text-[#B42318] shadow-sm">
        {ext}
      </span>
    </span>
  );
}
