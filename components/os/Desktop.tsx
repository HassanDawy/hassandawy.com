"use client";

import { useEffect } from "react";
import type { AppId } from "@/lib/apps/registry";
import { DESKTOP_QUERY } from "@/lib/breakpoints";
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
  // Below 768px the desktop is hidden (see DesktopPage), so wait until it shows.
  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY);
    function start() {
      if (!media.matches) return;
      media.removeEventListener("change", start);
      const { windows, open } = useWindows.getState();
      if (windows.length) return;
      if (initial) open(initial.appId, initial.props);
      else open("terminal");
    }
    media.addEventListener("change", start);
    start();
    return () => media.removeEventListener("change", start);
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
