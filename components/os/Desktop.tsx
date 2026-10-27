"use client";

import { useEffect } from "react";
import type { AppId } from "@/lib/apps/registry";
import { FsProvider } from "@/lib/fs/provider";
import type { DirNode } from "@/lib/fs/types";
import { useWindows, type WindowProps } from "@/lib/store/windows";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { WindowLayer } from "./WindowLayer";

/** The window a deep link opens instead of the Terminal, e.g. /projects/<slug>. */
export interface InitialWindow {
  appId: AppId;
  props: WindowProps;
}

export function Desktop({ tree, initial }: { tree: DirNode; initial?: InitialWindow }) {
  // The Terminal greets visitors on first load, unless a deep link asked for a window.
  useEffect(() => {
    const { windows, open } = useWindows.getState();
    if (windows.length) return;
    if (initial) open(initial.appId, initial.props);
    else open("terminal");
  }, [initial]);

  return (
    <FsProvider tree={tree}>
      <div className="bg-desktop-grid relative h-dvh w-full overflow-hidden select-none">
        <MenuBar />
        <DesktopIcons />
        <WindowLayer />
        <Dock />
      </div>
    </FsProvider>
  );
}
