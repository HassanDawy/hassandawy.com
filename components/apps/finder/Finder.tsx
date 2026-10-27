"use client";

import { Briefcase, ChevronLeft, ChevronRight, Folder, NotebookPen, Tags, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { openPath } from "@/lib/apps/open-path";
import { useFs } from "@/lib/fs/provider";
import { follow, resolve } from "@/lib/fs/resolve";
import type { FsNode } from "@/lib/fs/types";
import { useWindows } from "@/lib/store/windows";
import type { AppProps } from "../types";
import { EmptyTrashDialog } from "./EmptyTrashDialog";
import { FinderItem } from "./FinderItem";

const PLACES = [
  { label: "Projects", path: "~/projects", icon: Folder },
  { label: "Experience", path: "~/experience", icon: Briefcase },
  { label: "Notes", path: "~/notes", icon: NotebookPen },
  { label: "Skills", path: "~/skills", icon: Tags },
  { label: "Trash", path: "~/.trash", icon: Trash2 },
];

export default function Finder({ windowId, props }: AppProps) {
  const tree = useFs();
  const [nav, setNav] = useState(() => ({ stack: [String(props.path ?? "~/projects")], index: 0 }));
  const [selected, setSelected] = useState<string | null>(null);
  const [emptyingTrash, setEmptyingTrash] = useState(false);
  const emptyTrashRef = useRef<HTMLButtonElement>(null);
  const path = nav.stack[nav.index];
  const node = resolve(tree, path);
  const folder = node && follow(tree, node);
  const items = folder?.type === "dir" ? folder.children : [];
  const title =
    PLACES.find((p) => p.path === path)?.label ??
    (path === "~" ? "Home" : null) ??
    (path.startsWith("~/skills/") ? String(folder?.meta.title ?? "") : null) ??
    folder?.name ??
    "Not found";

  useEffect(() => {
    useWindows.getState().setProps(windowId, { path, title });
  }, [windowId, path, title]);

  function go(next: string) {
    setNav((n) => ({ stack: [...n.stack.slice(0, n.index + 1), next], index: n.index + 1 }));
    setSelected(null);
  }

  function step(delta: number) {
    setNav((n) => ({ ...n, index: n.index + delta }));
    setSelected(null);
  }

  function openItem(item: FsNode) {
    const launch = openPath(tree, item.path);
    if (!launch) return;
    if (launch.type === "url") window.open(launch.href, "_blank", "noopener");
    else if (launch.appId === "finder") go(launch.props.path);
    else useWindows.getState().open(launch.appId, launch.props);
  }

  // Skill folders are named by slug; show the tag as written.
  const labelOf = (item: FsNode) => (path === "~/skills" ? String(item.meta.title ?? item.name) : item.name);

  return (
    <div className="relative flex h-full text-[#1A1D23]">
      <nav aria-label="Places" className="flex w-[150px] shrink-0 flex-col gap-0.5 bg-[#EFEDE8] px-2.5 py-3.5 text-xs">
        <p className="mb-1.5 px-2 text-[11px] font-semibold text-[#6B6F78]">Favorites</p>
        {PLACES.map(({ label, path: placePath, icon: Icon }) => {
          const active = path === placePath || path.startsWith(`${placePath}/`);
          return (
            <button
              key={placePath}
              type="button"
              onClick={() => go(placePath)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-left ${
                active ? "bg-black/[0.07] font-semibold" : "text-[#4A4E57] hover:bg-black/[0.04]"
              }`}
            >
              <Icon size={14} className="text-folder" aria-hidden />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-10 shrink-0 items-center gap-1 border-b border-[#E2DFD8] px-3">
          <ToolbarButton label="Back" disabled={nav.index === 0} onClick={() => step(-1)} icon={ChevronLeft} />
          <ToolbarButton label="Forward" disabled={nav.index === nav.stack.length - 1} onClick={() => step(1)} icon={ChevronRight} />
          <span className="ml-2 truncate font-mono text-[11px] text-[#6B6F78]">{path}</span>
          {path === "~/.trash" && (
            <button
              ref={emptyTrashRef}
              type="button"
              onClick={() => setEmptyingTrash(true)}
              className="ml-auto shrink-0 rounded-md border border-[#CFCBC3] bg-white px-3 py-1 text-xs hover:bg-[#EFEDE8]"
            >
              Empty Trash
            </button>
          )}
        </div>

        <div
          className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(96px,1fr))] content-start gap-x-2 gap-y-4 overflow-y-auto p-4"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          {items.length === 0 && <p className="col-span-full text-xs text-[#6B6F78]">This folder is empty.</p>}
          {items.map((item) => (
            <FinderItem
              key={item.path}
              node={item}
              label={labelOf(item)}
              isDir={follow(tree, item)?.type === "dir"}
              dimmed={path.startsWith("~/.trash")}
              selected={selected === item.path}
              onSelect={() => setSelected(item.path)}
              onOpen={() => openItem(item)}
            />
          ))}
        </div>

        <footer className="shrink-0 border-t border-[#E2DFD8] px-4 py-1 text-[11px] text-[#6B6F78]">
          {items.length} {items.length === 1 ? "item" : "items"}
        </footer>
      </div>

      {emptyingTrash && (
        <EmptyTrashDialog
          onClose={() => {
            setEmptyingTrash(false);
            emptyTrashRef.current?.focus();
          }}
        />
      )}
    </div>
  );
}

function ToolbarButton({ label, disabled, onClick, icon: Icon }: { label: string; disabled: boolean; onClick: () => void; icon: typeof ChevronLeft }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="rounded-md p-1 text-[#4A4E57] hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <Icon size={18} aria-hidden />
    </button>
  );
}
