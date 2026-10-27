"use client";

import type { ReactNode } from "react";
import { apps, type AppId } from "@/lib/apps/registry";
import { useFs } from "@/lib/fs/provider";
import { resolve } from "@/lib/fs/resolve";
import { useWindows, type WindowProps } from "@/lib/store/windows";
import { AppIcon } from "./AppIcon";

// Each id is both an app and an AppIcon kind.
const DOCK_APPS = ["finder", "terminal", "notes", "skills"] as const;

export function Dock() {
  const tree = useFs();
  const resume = resolve(tree, "~/resume.pdf");
  const windows = useWindows((s) => s.windows);
  const { open, focus } = useWindows.getState();

  // Like macOS: clicking an app that is already open brings its frontmost window back.
  function launch(appId: AppId, props?: WindowProps) {
    const mine = windows.filter((w) => w.appId === appId);
    if (mine.length && !props) focus(mine.reduce((a, b) => (b.z > a.z ? b : a)).id);
    else open(appId, props);
  }

  return (
    <nav
      aria-label="Dock"
      className="absolute bottom-3.5 left-1/2 z-[9999] flex h-[72px] -translate-x-1/2 items-center gap-3 rounded-[20px] border border-white/12 bg-[rgba(30,38,52,0.72)] px-3.5 backdrop-blur-md"
    >
      {DOCK_APPS.map((id) => (
        <DockItem key={id} label={apps[id].title} running={windows.some((w) => w.appId === id)}>
          <button type="button" aria-label={apps[id].title} onClick={() => launch(id)} className="block rounded-[12px]">
            <AppIcon kind={id} />
          </button>
        </DockItem>
      ))}

      <span className="h-10 w-px bg-white/20" aria-hidden />

      {resume && (
        <DockItem label="Resume">
          <a href={String(resume.meta.href)} target="_blank" rel="noopener" aria-label="Resume (PDF)" className="block rounded-[12px]">
            <AppIcon kind="pdf" />
          </a>
        </DockItem>
      )}
      <DockItem label="Trash">
        <button
          type="button"
          aria-label="Trash"
          onClick={() => launch("finder", { path: "~/.trash" })}
          className="block rounded-[12px]"
        >
          <AppIcon kind="trash" />
        </button>
      </DockItem>
    </nav>
  );
}

// Tile with a hover label above it and a dot below when the app has windows.
function DockItem({ label, running, children }: { label: string; running?: boolean; children: ReactNode }) {
  return (
    <div className="group relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 rounded-md bg-[rgba(10,14,22,0.9)] px-2 py-1 text-xs whitespace-nowrap text-menubar-text opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        {label}
      </span>
      <div className="transition-transform duration-150 group-hover:-translate-y-1">{children}</div>
      <span
        aria-hidden
        className={`absolute -bottom-2 size-1 rounded-full bg-menubar-text ${running ? "" : "opacity-0"}`}
      />
    </div>
  );
}
