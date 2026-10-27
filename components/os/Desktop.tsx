"use client";

import { useEffect } from "react";
import { FsProvider } from "@/lib/fs/provider";
import type { DirNode } from "@/lib/fs/types";
import { useWindows } from "@/lib/store/windows";
import { DesktopIcons } from "./DesktopIcons";
import { Dock } from "./Dock";
import { MenuBar } from "./MenuBar";

export function Desktop({ tree }: { tree: DirNode }) {
  const setViewport = useWindows((s) => s.setViewport);

  useEffect(() => {
    const update = () => setViewport(window.innerWidth, window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [setViewport]);

  return (
    <FsProvider tree={tree}>
      <div className="bg-desktop-grid relative h-dvh w-full overflow-hidden select-none">
        <MenuBar />
        <DesktopIcons />
        {/* Windows render here (TASKS.md 5). */}
        <Dock />
      </div>
    </FsProvider>
  );
}
