"use client";

import { apps } from "@/lib/apps/registry";
import { useWindows } from "@/lib/store/windows";
import type { AppProps } from "../types";

// Test app used to check the window manager until each real app is built.
export default function EmptyApp({ windowId, props }: AppProps) {
  const win = useWindows((s) => s.windows.find((w) => w.id === windowId));
  if (!win) return null;

  return (
    <div className="flex h-full flex-col gap-2 p-5 font-mono text-xs opacity-80">
      <p className="font-sans text-sm">{apps[win.appId].title} is not built yet.</p>
      <p>window: {windowId}</p>
      <p>props: {JSON.stringify(props)}</p>
    </div>
  );
}
