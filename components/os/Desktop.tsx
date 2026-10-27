"use client";

import { FsProvider } from "@/lib/fs/provider";
import type { DirNode } from "@/lib/fs/types";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";
import { WindowLayer } from "./WindowLayer";

export function Desktop({ tree }: { tree: DirNode }) {
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
