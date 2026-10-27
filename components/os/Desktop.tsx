"use client";

import { useEffect } from "react";
import { FsProvider } from "@/lib/fs/provider";
import type { DirNode } from "@/lib/fs/types";
import { useWindows } from "@/lib/store/windows";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { WindowLayer } from "./WindowLayer";

export function Desktop({ tree }: { tree: DirNode }) {
  // The Terminal greets visitors on first load.
  useEffect(() => {
    const { windows, open } = useWindows.getState();
    if (!windows.length) open("terminal");
  }, []);

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
